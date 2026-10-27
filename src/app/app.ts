import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarefaService } from './services/tarefa.service';
import { Prioridade, StatusTarefa, Tarefa } from './models/tarefa.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private tarefaService = inject(TarefaService);

  // Signals de estado
  tarefas = signal<Tarefa[]>([]);
  carregando = signal<boolean>(false);
  termoBusca = signal<string>('');
  filtroStatus = signal<string>('TODAS');
  filtroPrioridade = signal<string>('TODAS');

  // Modal State
  modalAberto = signal<boolean>(false);
  modoEdicao = signal<boolean>(false);
  tarefaEditandoId = signal<number | null>(null);

  // Form Fields
  formTitulo = signal<string>('');
  formDescricao = signal<string>('');
  formPrioridade = signal<Prioridade>('MEDIA');

  // Toast Notification
  toast = signal<{ mensagem: string; tipo: 'sucesso' | 'erro' | 'info' } | null>(null);

  // Computeds reativos de alta performance
  totalTarefas = computed(() => this.tarefas().length);
  tarefasConcluidas = computed(() => this.tarefas().filter(t => t.status === 'CONCLUIDA').length);
  tarefasEmAndamento = computed(() => this.tarefas().filter(t => t.status === 'EM_ANDAMENTO').length);
  tarefasPendentes = computed(() => this.tarefas().filter(t => t.status === 'PENDENTE').length);

  progressoConclusao = computed(() => {
    const total = this.totalTarefas();
    if (total === 0) return 0;
    return Math.round((this.tarefasConcluidas() / total) * 100);
  });

  tarefasFiltradas = computed(() => {
    const busca = this.termoBusca().toLowerCase().trim();
    const status = this.filtroStatus();
    const prioridade = this.filtroPrioridade();

    return this.tarefas().filter(t => {
      const matchBusca = !busca || 
        t.titulo.toLowerCase().includes(busca) || 
        (t.descricao && t.descricao.toLowerCase().includes(busca));

      const matchStatus = status === 'TODAS' || t.status === status;
      const matchPrioridade = prioridade === 'TODAS' || t.prioridade === prioridade;

      return matchBusca && matchStatus && matchPrioridade;
    });
  });

  ngOnInit() {
    this.carregarTarefas();
  }

  carregarTarefas() {
    this.carregando.set(true);
    this.tarefaService.listar().subscribe({
      next: (dados) => {
        this.tarefas.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
        this.mostrarToast('Erro ao carregar tarefas do servidor', 'erro');
      }
    });
  }

  abrirModalCriar() {
    this.modoEdicao.set(false);
    this.tarefaEditandoId.set(null);
    this.formTitulo.set('');
    this.formDescricao.set('');
    this.formPrioridade.set('MEDIA');
    this.modalAberto.set(true);
  }

  abrirModalEditar(t: Tarefa) {
    this.modoEdicao.set(true);
    this.tarefaEditandoId.set(t.id);
    this.formTitulo.set(t.titulo);
    this.formDescricao.set(t.descricao || '');
    this.formPrioridade.set(t.prioridade);
    this.modalAberto.set(true);
  }

  fecharModal() {
    this.modalAberto.set(false);
  }

  salvarTarefa() {
    const titulo = this.formTitulo().trim();
    if (!titulo) {
      this.mostrarToast('Por favor, informe o título da tarefa', 'erro');
      return;
    }

    if (this.modoEdicao() && this.tarefaEditandoId()) {
      const id = this.tarefaEditandoId()!;
      this.tarefaService.atualizar(id, {
        titulo,
        descricao: this.formDescricao().trim(),
        prioridade: this.formPrioridade()
      }).subscribe({
        next: (atualizada) => {
          this.tarefas.update(lista => lista.map(item => item.id === id ? { ...item, ...atualizada } : item));
          this.fecharModal();
          this.mostrarToast('Tarefa atualizada com sucesso!', 'sucesso');
        },
        error: () => this.mostrarToast('Erro ao atualizar tarefa', 'erro')
      });
    } else {
      this.tarefaService.criar({
        titulo,
        descricao: this.formDescricao().trim(),
        prioridade: this.formPrioridade()
      }).subscribe({
        next: (nova) => {
          this.tarefas.update(lista => [nova, ...lista]);
          this.fecharModal();
          this.mostrarToast('Nova tarefa criada com sucesso!', 'sucesso');
        },
        error: () => this.mostrarToast('Erro ao criar tarefa', 'erro')
      });
    }
  }

  alternarStatus(t: Tarefa) {
    let proximoStatus: StatusTarefa;
    if (t.status === 'PENDENTE') {
      proximoStatus = 'EM_ANDAMENTO';
    } else if (t.status === 'EM_ANDAMENTO') {
      proximoStatus = 'CONCLUIDA';
    } else {
      proximoStatus = 'PENDENTE';
    }

    this.tarefaService.alterarStatus(t.id, proximoStatus).subscribe({
      next: (atualizada) => {
        this.tarefas.update(lista => 
          lista.map(item => item.id === t.id ? { ...item, status: proximoStatus } : item)
        );
        this.mostrarToast(`Status alterado para: ${proximoStatus}`, 'info');
      },
      error: () => this.mostrarToast('Erro ao alterar status', 'erro')
    });
  }

  deletarTarefa(id: number) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.tarefaService.deletar(id).subscribe({
        next: () => {
          this.tarefas.update(lista => lista.filter(item => item.id !== id));
          this.mostrarToast('Tarefa excluída!', 'info');
        },
        error: () => this.mostrarToast('Erro ao excluir tarefa', 'erro')
      });
    }
  }

  formatarData(dataStr?: string): string {
    if (!dataStr) return 'Hoje';
    try {
      const d = new Date(dataStr);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dataStr;
    }
  }

  mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro' | 'info') {
    this.toast.set({ mensagem, tipo });
    setTimeout(() => {
      this.toast.set(null);
    }, 3200);
  }
}
