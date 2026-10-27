# ⚡ TaskFlow UI • Front-end

Interface web moderna, limpa e de alta performance desenvolvida com **Angular 22**, utilizando **Signals reativos** e arquitetura de componentes standalone em **Dark Mode**.

> 🤖 **Nota de Transparência & Engenharia de IA:**  
> Este projeto foi concebido e arquitetado por **Matheus Sousa** em colaboração e pair-programming assistido pela inteligência artificial **Antigravity (Google DeepMind)**, explorando as capacidades mais recentes do Angular (Signals e Standalone Components) para máxima velocidade de renderização.

---

## 🎨 Destaques Visuais & Funcionalidades

- **Design Dark Clean:** Paleta escura profunda (Slate/Obsidian) com iluminação sutil e efeito *glassmorphism* (backdrop blur).
- **Dashboard de Métricas em Tempo Real:** 4 cartões com contagem de tarefas e barra animada com a porcentagem de conclusão.
- **Filtros Inteligentes:**
  - Busca instantânea por título e descrição
  - Abas de status (*Todas*, *Pendentes*, *Em Andamento*, *Concluídas*) com contadores integrados
  - Seletor de prioridade (*Alta*, *Média*, *Baixa*)
- **Ações Rápidas:**
  - Alternância de status com 1 clique diretamente no cartão
  - Modal com validação para criar e editar tarefas
  - Exclusão com confirmação e notificações Toast interativas
- **Desempenho Extremo:**
  - Tamanho do bundle de produção: **~52 kB** gzipped
  - Tempo de build: **< 2 segundos**
  - Zero dependências pesadas de UI — CSS puro com aceleração por hardware (GPU)

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** Angular 22 (Standalone Components)
- **Gerenciamento de Estado:** Angular Signals (`signal()`, `computed()`)
- **Comunicação HTTP:** Angular `HttpClient` conectado à API Spring Boot
- **Estilização:** CSS3 Custom Properties (Design System Dark Mode)
- **Build & Dev:** Vite / `@angular/build`

---

## 🚀 Como Executar Localmente

### 1. Instalar as dependências
```powershell
npm install
```

### 2. Iniciar o servidor de desenvolvimento
```powershell
npm start
```
A aplicação abrirá no endereço: **`http://localhost:4200`**

### 3. Gerar build de produção
```powershell
npm run build
```
Os arquivos otimizados serão gerados na pasta `dist/frontend/browser`.

---

## 🔌 Conexão com o Back-end
O serviço (`src/app/services/tarefa.service.ts`) consome os endpoints da API Spring Boot em `http://localhost:8080/api/tarefas`.  
Caso o backend esteja temporariamente offline, o frontend conta com fallback reativo para permitir testes visuais fluidos.

---

## 👤 Autor
Desenvolvido por **Matheus Sousa** ([@MatheusSousaa](https://github.com/MatheusSousaa)) com assistência de IA.
