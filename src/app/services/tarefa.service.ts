import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Tarefa, CriarTarefaRequest, AtualizarTarefaRequest, StatusTarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/tarefas';

  private fallbackTarefas: Tarefa[] = [
    {
      id: 1,
      titulo: 'Estudar Angular e Signals',
      descricao: 'Aprender arquitetura baseada em sinais e componentes standalone no Angular',
      prioridade: 'ALTA',
      status: 'EM_ANDAMENTO',
      dataCriacao: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    },
    {
      id: 2,
      titulo: 'Configurar PostgreSQL e Spring Boot',
      descricao: 'Integrar Spring Data JPA com banco de dados relacional PostgreSQL local',
      prioridade: 'ALTA',
      status: 'CONCLUIDA',
      dataCriacao: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: 3,
      titulo: 'Desenvolver interface Dark Mode',
      descricao: 'Criar UI limpa, minimalista e de alta performance com design moderno',
      prioridade: 'MEDIA',
      status: 'EM_ANDAMENTO',
      dataCriacao: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      titulo: 'Revisar testes unitarios',
      descricao: 'Cobrir endpoints de tarefas com testes e validacoes',
      prioridade: 'BAIXA',
      status: 'PENDENTE',
      dataCriacao: new Date().toISOString()
    }
  ];

  listar(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl).pipe(
      catchError(err => {
        console.warn('Backend offline ou inacessível. Usando dados locais sincronizados.', err);
        return of(this.fallbackTarefas);
      })
    );
  }

  buscarPorId(id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.apiUrl}/${id}`);
  }

  criar(req: CriarTarefaRequest): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.apiUrl, req).pipe(
      catchError(() => {
        const nova: Tarefa = {
          id: Date.now(),
          titulo: req.titulo,
          descricao: req.descricao,
          prioridade: req.prioridade,
          status: 'PENDENTE',
          dataCriacao: new Date().toISOString()
        };
        this.fallbackTarefas.unshift(nova);
        return of(nova);
      })
    );
  }

  atualizar(id: number, req: AtualizarTarefaRequest): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.apiUrl}/${id}`, req).pipe(
      catchError(() => {
        const index = this.fallbackTarefas.findIndex(t => t.id === id);
        if (index !== -1) {
          this.fallbackTarefas[index] = {
            ...this.fallbackTarefas[index],
            ...req
          };
          return of(this.fallbackTarefas[index]);
        }
        throw new Error('Tarefa não encontrada');
      })
    );
  }

  alterarStatus(id: number, status: StatusTarefa): Observable<Tarefa> {
    return this.http.patch<Tarefa>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError(() => {
        const index = this.fallbackTarefas.findIndex(t => t.id === id);
        if (index !== -1) {
          this.fallbackTarefas[index].status = status;
          return of(this.fallbackTarefas[index]);
        }
        throw new Error('Tarefa não encontrada');
      })
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        this.fallbackTarefas = this.fallbackTarefas.filter(t => t.id !== id);
        return of(void 0);
      })
    );
  }
}
