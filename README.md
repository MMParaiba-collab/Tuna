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
7. [Tela de integrantes do grupo](#7-tela-de-integrantes-do-grupo)
8. [Geração do arquivo APK](#8-geração-do-arquivo-apk)
9. [Tecnologias, bibliotecas e linguagens](#9-tecnologias-bibliotecas-e-linguagens)
10. [Banco de dados local](#10-banco-de-dados-local)

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
| RF01 | Meu estoque | O sistema deve obter automaticamente, quando houver internet, a lista de todos os produtos da loja e gravá-la no banco local, mantendo-a atualizada |
| RF02 | Meu estoque | O sistema deve obter dados de tendências do mercado quando houver internet e gravá-los no banco local |
| RF03 | Meu estoque | O sistema deve exibir os resultados das análises dos cruzamentos de dados (loja x mercado), recomendando a inclusão de novos produtos, reposição e estratégia para conseguir vender produtos “encalhados” |
| RF04 | Meu preço | O sistema deve obter os preços praticados por grandes e-commerces quando houver internet e gravá-los no banco local |
| RF05 | Meu preço | O sistema deve comparar o preço de cada produto da loja com o preço dos e-commerces e alertar o lojista quando o produto estiver fora da margem competitiva |
| RF06 | Meu cliente | O sistema deve obter automaticamente, quando houver internet, a lista de clientes e o histórico de compras da loja e gravá-los no banco local, mantendo-os atualizados |
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





