export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA';
export type StatusTarefa = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  status: StatusTarefa;
  dataCriacao?: string;
}

export interface CriarTarefaRequest {
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
}

export interface AtualizarTarefaRequest {
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
}
