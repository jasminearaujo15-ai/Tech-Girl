# TECH GIRL · UnDF 2026/2027

Espaço privado de apoio à execução do programa **Tech Girl – Códigos que Incluem**. Calendário com filtros, fichas de atividades, dez projetos, hackathon, escolas e acompanhamento de metas/produtos.

## Conteúdo inicial

- Metas do Anexo 04: 12 atividades, 10 projetos, 1 hackathon, pelo menos 3 escolas, cerca de 30 estudantes da UnDF e 80 da educação básica.
- Os 12 temas são propostas pedagógicas editáveis. Não há datas de atividades, escolas nomeadas, equipes ou resultados fictícios.
- Prazo registrado para o primeiro relatório: 15/12/2026, conforme os planos operacionais da usuária.
- Cronograma relativo M1–M12. A proposta original (ago/2026–jul/2027) e o início operacional posterior (out/2026) são explicados em Sobre.

Fontes consultadas: Anexo 04, Plano de Primeiro Semestre e Plano de Implantação Revisado, fornecidos pela proprietária do projeto.

## Operação

Clique nos cartões para atualizar detalhes, datas, responsáveis, status e links de evidência. Apenas itens concluídos incrementam as metas de execução; escolas devem estar no status Atendida. Alcance de pessoas únicas é informado separadamente para evitar duplicidade. Registros são persistidos no D1 e compartilhados entre dispositivos da proprietária. Exportações JSON e ICS são geradas no navegador.

## Acesso e dados

O Site mantém a audiência privada definida pela proprietária. A nova área `/courses` separa a aprendizagem da gestão. A identidade de cada participante vem do login do ChatGPT; o ID estável do Site é usado como chave dos registros. Cada conta só altera suas próprias matrículas, aulas, entregas e avaliações. Gestão de cursos, análise de conclusões, registros de outras participantes e a API do programa exigem o papel administrativo no servidor. O e-mail administrativo é configurado como segredo do ambiente de hospedagem, conforme a chave documentada em `.env.example`.

Nenhum convite é criado automaticamente. A inclusão de participantes na audiência do Site depende da autorização da proprietária. O catálogo de cursos disponíveis é compatível com leitura sem identidade em prévia local; no endereço hospedado, a barreira privada do Sites continua exigindo autenticação e autorização de acesso.

Links de materiais e documentos devem usar HTTPS. A nota é calculada no servidor, sem aceitar pontuação enviada pelo navegador. O gabarito não integra as respostas do catálogo para alunas. Cada matrícula guarda uma versão do conteúdo e dos critérios; edições posteriores não reescrevem o histórico já iniciado. As aulas são registradas de forma autodeclarada, com entrega prática e avaliação separadas. Registros são persistidos no D1, sem depender de LocalStorage. Alterações administrativas de análise possuem trilha de auditoria.

## Desenvolvimento

`npm run dev`, `npx tsc --noEmit`, `npm run build`. Modelo Drizzle em `db/schema.ts`; migração schema-only em `drizzle/`. Novas alterações de banco exigem migração adicional, sem modificar migrações já aplicadas.

O banco de prévia é separado do banco hospedado. Não incluir dados de QA na carga inicial. Identidade visual alinhada à referência TECH GIRL fornecida pela proprietária, com vinho, laranja e tons de creme. Não utiliza uma reprodução não validada da logomarca oficial da UnDF.

## Melhorias de uso

A visão geral mostra pendências calculadas a partir dos dados atuais. A agenda permite escolher mês/ano e isolar atividades sem data; uma atividade nova aberta a partir de um dia selecionado já recebe essa data. Produtos possuem busca por título/responsável e filtro de status. O resumo em CSV preserva acentos e protege campos textuais contra fórmulas. A exportação ICS mantém horários de Brasília, duração informada, prazos de dia inteiro e cancelamentos. Validação: `node --experimental-strip-types --test tests/exports.test.mjs`.

## Campus online e certificação

Acesso em `/courses`. Três cursos piloto originais: Cidadania e segurança digital, Lógica de programação para começar e Sua primeira página na web. Cada um contém três aulas, exercícios, uma entrega prática e cinco questões. A carga de 8 horas e a nota mínima de 70/100 são propostas de planejamento pedagógico a validar pela coordenação, não critérios oficiais presumidos. A primeira página web inclui um laboratório de HTML/CSS isolado, sem JavaScript e sem recursos externos; o código pode ser incorporado à entrega.

Fluxo: matrícula → aulas + prática + avaliação → conclusão técnica → solicitação de validação → análise da gestão → disponibilização do link de documento efetivamente emitido pela instituição. O comprovante imprimível em `/courses/record/:id` é um **registro interno sem validade institucional**, identificado como tal. Não há geração de certificado oficial, assinatura institucional simulada ou promessa automática de horas certificadas. A gestão precisa informar referência, link e confirmação de emissão pela PROEXTC/UnDF para disponibilizar um documento institucional.

Base: Resolução UnDF nº 10/2023, art. 62, https://www.sinj.df.gov.br/sinj/Norma/f4df048255e4423aa57295316240cf5e/Resolu_o_10_01_06_2023.html; Documento Orientador nº 01, itens 5.4 e 5.5, https://universidade.df.gov.br/documents/9295213/9774684/Documento-orientador-Envio-das-PECs-3.pdf. Os registros da plataforma apoiam o fluxo institucional e não substituem o relatório e a frequência exigidos pela universidade.

Testes do campus: `node scripts/test-learning.mjs`. Cobrem segregação entre participantes, bloqueio de notas forjadas, requisitos para solicitar análise, autorização da gestão, disponibilização institucional, versionamento de cursos e matrículas idempotentes, usando SQLite real com a migração. O banco de teste e o de prévia são separados do banco hospedado.

## Repositório e hospedagem

Este repositório contém somente código, migrações de estrutura e conteúdo pedagógico inicial. Matrículas, entregas, progresso, dados operacionais e credenciais não fazem parte dele. O acesso ao código no GitHub é independente da audiência privada configurada para o Site. A versão hospedada utiliza Sites, Cloudflare D1 e identidade autenticada do ChatGPT; a implantação em outro ambiente exige configurar banco, autenticação e segredos equivalentes.
