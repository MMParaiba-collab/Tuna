# Tuna - Afine seu negócio

Aplicativo móvel desenvolvido para o Projeto Integrador VI-B (Turma MA - TAS8130 ), envolvendo os conhecimentos das disciplinas Ciência dos Dados e Programação para Dispositivos Móveis II

---

## Sumário

1. [Nome do projeto](#1-nome-do-projeto)
2. [Problema que resolve](#2-problema-que-resolve)
3. [Público-alvo](#3-público-alvo)
4. [Características do aplicativo](#4-características-do-aplicativo)
5. [Modelo ER do banco de dados local](#5-modelo-er-do-banco-de-dados-local)
6. [Wireframe das telas](#6-wireframe-das-telas)
7. [Geração do arquivo APK](#8-geração-do-arquivo-apk)
8. [Tecnologias, bibliotecas e linguagens](#9-tecnologias-bibliotecas-e-linguagens)
9. [Banco de dados local](#10-banco-de-dados-local)

---

## 1. Nome do projeto

**Tuna**

**Slogan:** *"Afine seu negócio."*

O nome vem de *tuning* (afinar). Assim como um músico afina o instrumento para soar no tom certo, o Tuna "afina" a presença digital e a gestão estratégica para que a empresa tome decisões mais precisas em seus negócios.

---

## 2. Problema que resolve

- Modelagem de estoque:

O estoque de instrumentos é caro, tem alto valor agregado e baixo giro. Errar na variedade dos produtos pode quebrar o caixa da loja. A coleta e análise de dados das grandes marcas do setor e redes sociais, identifica tendências de consumo, podendo resolver esse desafio e por consequência aumentar as vendas.

- Precificação de produtos:

Muitos clientes utilizam as lojas físicas apenas para testar os instrumentos e, posteriormente, finalizam a compra em grandes e-commerces que oferecem preços menores. O rastreamento dos preços de grandes e-commerces junto ao alerta ao lojista, auxiliarão quando o preço dele ficou fora da margem competitiva.

- Segmentação de clientes:

Existe uma dificuldade de saber em qual nível musical os clientes estão. Com base no histórico de compras de cada um, o Tuna traz um modelo que os classifica nos níveis “Iniciante”, “Intermediário” e “Profissional”, facilitando a correta recomendação dos produtos que poderão comprar no futuro.

---

## 3. Público-alvo

- **Lojistas e gestores de lojas de instrumentos musicais**


---

## 4. Características do aplicativo

### 4.1 Requisitos funcionais

| Código | Módulo | Descrição |
|---|---|---|
| RF01 | Meu estoque | O sistema deve obter automaticamente, quando houver internet, a lista de todos os produtos da loja e gravá-la no banco local, mantendo-a atualizada, também possibilitando a importação manual de dados |
| RF02 | Meu estoque | O sistema deve obter dados de tendências do mercado quando houver internet e gravá-los no banco local |
| RF03 | Meu estoque | O sistema deve exibir os resultados das análises dos cruzamentos de dados (loja x mercado), recomendando a inclusão de novos produtos, reposição e estratégia para conseguir vender produtos “encalhados” |
| RF04 | Meu preço | O sistema deve obter os preços praticados por grandes e-commerces quando houver internet e gravá-los no banco local |
| RF05 | Meu preço | O sistema deve comparar o preço de cada produto da loja com o preço dos e-commerces e alertar o lojista quando o produto estiver fora da margem competitiva |
| RF06 | Meu cliente | O sistema deve obter automaticamente, quando houver internet, a lista de clientes e o histórico de compras da loja e gravá-los no banco local, mantendo-os atualizados, também possibilitando a importação manual de dados |
| RF07 | Meu cliente | O sistema deve classificar os clientes em “Iniciante”, “Intermediário” e “Profissional” com base no histórico de compras e recomendar produtos adequados a cada nível |
| RF08 | Sobre | O sistema deve exibir uma tela com o nome completo de todos os integrantes do grupo |

### 4.2 Requisitos não funcionais

| Código | Categoria | Descrição |
|---|---|---|
| RNF01 | Disponibilidade offline | O aplicativo deve manter todas as funcionalidades de consulta, análise e recomendação disponíveis sem internet, usando os dados já gravados no banco SQLite local |
| RNF02 | Rastreabilidade | Os dados obtidos pela sincronização devem ser gravados com data e fonte, e a data da última atualização deve ser exibida na tela |
| RNF03 | Confiabilidade | Uma falha na sincronização não deve apagar nem corromper os dados já salvos no banco local |
| RNF04 | Usabilidade | A interface deve ser simples e objetiva, permitindo ao lojista consultar indicadores e recomendações com poucos toques |
| RNF05 | Portabilidade | O aplicativo deve ser desenvolvido em Ionic/Angular e empacotado para Android com Capacitor |

---

## 5. Modelo ER do banco de dados local

<img width="1116" height="1048" alt="Untitled" src="https://github.com/user-attachments/assets/7eacb1c3-04f2-42c7-904f-d12fa6f9eab2" />

O banco de dados local (SQLite) possui as seguintes entidades principais:
* **produto:** Armazena o catálogo de itens da loja para funcionamento offline.
* **tendencia:** Guarda dados de mercado (categorias e marcas) para análises e recomendações.
* **preco_concorrente:** Registra os preços de e-commerces para comparar com os produtos da loja.
* **cliente:** Cadastro dos clientes com sua respectiva classificação de nível.
* **venda / item_venda:** Histórico de compras para rastreabilidade.
* **sync_log:** Registro de auditoria das sincronizações com a nuvem.

**Código fonte do diagrama (DBML):**

```sql
Table produto {
  id integer [pk, increment]
  codigo text [not null, unique]
  nome text [not null]
  categoria text [not null]
  marca text
  preco real [not null]
  quantidade integer [not null, default: 0]
  data_atualizacao text [not null]
}

Table tendencia {
  id integer [pk, increment]
  categoria text [not null]
  marca text
  indice_popularidade real [not null]
  fonte text [not null]
  data_coleta text [not null]
}

Table preco_concorrente {
  id integer [pk, increment]
  produto_id integer [not null]
  concorrente text [not null]
  preco real [not null]
  fonte text [not null]
  data_coleta text [not null]
}

Table cliente {
  id integer [pk, increment]
  nome text [not null]
  telefone text [unique]
  email text
  nivel text [note: 'Iniciante, Intermediário ou Profissional']
  data_atualizacao text [not null]
}

Table venda {
  id integer [pk, increment]
  cliente_id integer [not null]
  data_venda text [not null]
  total real [not null]
}

Table item_venda {
  id integer [pk, increment]
  venda_id integer [not null]
  produto_id integer [not null]
  quantidade integer [not null]
  preco_unitario real [not null]
}

Table sync_log {
  id integer [pk, increment]
  tipo text [not null]
  data_sync text [not null]
  status text [not null]
  registros integer [not null, default: 0]
}

Ref: preco_concorrente.produto_id > produto.id
Ref: venda.cliente_id > cliente.id
Ref: item_venda.venda_id > venda.id
Ref: item_venda.produto_id > produto.id
```

---

## 6. Wireframe das telas

  ### 6.1 Tela principal (splash)

**Objetivo:** apresentar a marca e iniciar a sincronização dos dados.

**Elementos principais:**
- Selo "Offline-first", logo, nome e slogan do Tuna;
- Botão "Abrir", que leva à tela Home;
- Mensagem informando que os dados ficam disponíveis mesmo sem internet.

**Requisitos atendidos:** RF01, RF02, RF04, RF06 (sincronização quando há internet) e RNF01.

**Dados utilizados:** `sync_log` (data e resultado da última sincronização).

<p align="center">
<img width="278" height="490" alt="PRINCIPAL" src="https://github.com/user-attachments/assets/be23db72-b245-470b-9ccd-087728a97cdc" />
</p>

---

### 6.2 Home

**Objetivo:** dar ao lojista uma visão geral dos três módulos do app.

**Elementos principais:**
- Saudação e data da última atualização dos dados;
- Sino de alertas;
- Um card-resumo por módulo (Meu estoque, Meu preço e Meu cliente), com acesso à tela correspondente;
- Barra de navegação inferior (Início, Meu estoque, Meu preço, Meu cliente e Sobre).

**Requisitos atendidos:** RF03, RF05, RF07 (resumos) e RNF02 (data da atualização).

**Dados utilizados:** consultas de resumo em `produto`, `preco_concorrente`, `cliente` e `sync_log`.

<p align="center">
<img width="288" height="476" alt="HOME" src="https://github.com/user-attachments/assets/01e8f1af-fe1a-41ec-a599-0642531f8ef4" />
</p>

---

### 6.3 Meu estoque

**Objetivo:** mostrar o cruzamento entre os produtos da loja e as tendências do mercado.

**Elementos principais:**
- Indicadores de produtos em alta, encalhados e para repor;
- Gráfico de rosca com os produtos por situação;
- Lista de recomendações (reposição e estratégia para produtos encalhados);
- Lista de oportunidades (produtos em alta que a loja ainda não possui).

**Requisitos atendidos:** RF03, RNF01 e RNF02.

**Dados utilizados:** `produto`, `item_venda`, `venda` e `tendencia`.

<p align="center">
<img width="266" height="478" alt="ESTOQUE" src="https://github.com/user-attachments/assets/432af597-d056-4719-a7df-75939aad079e" />
</p>

---

### 6.4 Meu preço

**Objetivo:** comparar os preços da loja com os praticados pelos grandes e-commerces.

**Elementos principais:**
- Indicadores de produtos fora e dentro da margem e diferença média;
- Gráfico de barras com a diferença percentual por produto e a linha da margem competitiva;
- Alertas de preço com o valor da loja, o valor do mercado, o e-commerce de origem e a evolução da diferença.

**Requisitos atendidos:** RF05, RNF01 e RNF02.

**Dados utilizados:** `produto` e `preco_concorrente`.

<p align="center">
<img width="262" height="482" alt="PREÇO" src="https://github.com/user-attachments/assets/7d29a589-65b2-47e6-9a00-1b23aec11708" />
</p>

---

### 6.5 Meu cliente

**Objetivo:** apresentar a classificação dos clientes e recomendar produtos adequados a cada nível.

**Elementos principais:**
- Indicadores de clientes por nível (Iniciante, Intermediário e Profissional);
- Gráfico combinado com o total de clientes e os clientes ativos por nível;
- Lista de clientes com nível, data da última compra e sugestão de produto.

**Requisitos atendidos:** RF06, RF07 e RNF01.

**Dados utilizados:** `cliente`, `venda`, `item_venda` e `produto`.


<p align="center">
<img width="272" height="479" alt="CLIENTE" src="https://github.com/user-attachments/assets/78dcf4c1-a1b4-4a59-bd43-ca892602a178" />
</p>

---

### 6.6 Sobre

**Objetivo:** identificar o aplicativo e os integrantes do grupo.

**Elementos principais:**
- Lista numerada com o nome completo de todos os integrantes;
- Logo, nome e slogan do Tuna.

**Requisitos atendidos:** RF08.

<p align="center">
<img width="269" height="492" alt="SOBRE" src="https://github.com/user-attachments/assets/83eb7e9b-f64f-4446-a51b-af4ffb255457" />
</p>

---

### 6.7 Diagrama de navegação (visão geral)

**Objetivo:** apresentar em uma única imagem todas as telas do Tuna e como o usuário navega entre elas.

**Como ler o diagrama:**
- Cada retângulo é uma tela do aplicativo, e as setas tracejadas indicam o caminho de navegação;
- A linha de cima reúne a **Tela principal**, a **Home** e a tela **Sobre**; a linha de baixo reúne as telas dos três módulos de análise: **Meu estoque**, **Meu preço** e **Meu cliente**.

**Fluxo de navegação:**
1. Ao abrir o aplicativo, o usuário vê a **Tela principal** (splash) e toca em "Abrir" para chegar à **Home**;
2. Da **Home**, ele acessa os módulos **Meu estoque**, **Meu preço** e **Meu cliente**, pelos cards-resumo ou pela barra de navegação inferior;
3. A tela **Sobre**, com a identificação do grupo, também é acessada pela barra de navegação inferior.

**Navegação entre telas:**
- Todas as telas, exceto a principal, compartilham a mesma **barra de navegação inferior** (Início, Meu estoque, Meu preço, Meu cliente e Sobre), que permite ir de qualquer tela para outra diretamente;
- O item da tela atual aparece destacado na barra, e por isso o aplicativo não usa botão de voltar;
- Para simplificar o diagrama, as setas mostram apenas o fluxo principal a partir da Home, e a navegação direta pela barra não foi desenhada entre todas as telas.

**Requisitos atendidos:** RNF04 (interface simples e objetiva) e RF08 (acesso à tela Sobre).

<p align="center">
<img width="421" height="496" alt="WIREFRAMES - DIAGRAMA" src="https://github.com/user-attachments/assets/d56f60f2-5ffd-4946-9485-c3a0f9477bec" />
</p>

---

## 7. Geração do arquivo APK

---

## 8. Tecnologias, bibliotecas e linguagens

---

## 9. Banco de dados local













