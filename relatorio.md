# Relatorio diario de commits - 2026

**Autor:** RafaelFett  
**Periodo:** 2026-01-07 a 2026-06-14  
**Gerado em:** 14/06/2026 13:26

---

## Resumo executivo

| Metrica | Valor |
|---------|-------|
| Projetos | 14 |
| Dias com atividade | 93 |
| Total de commits | 463 |
| Linhas alteradas | 563441 |
| Tempo estimado (soma) | ~1333.3 h |

> Tempo e impacto sao **estimativas** derivadas do tamanho do diff e do texto do commit, nao medicao real.

### Por projeto

| Projeto | Commits | Linhas | Tempo est. |
|---------|---------|--------|------------|
| FiscalMind (IA fiscal) | 61 | 152972 | ~195.1h |
| Sistema de Projetos Interno | 24 | 136129 | ~52.6h |
| Controle de EPI | 118 | 107248 | ~366.4h |
| Dashboard de Transporte / Frota | 64 | 71088 | ~253h |
| Linha de ProduÃ§Ã£o Petkov | 75 | 56007 | ~249h |
| Agenda Sala de Reuniao (rodrigolessa1980) | 55 | 14186 | ~88h |
| ExpediÃ§Ã£o | 29 | 10351 | ~56.6h |
| Site QuietArt (marketing) | 10 | 5983 | ~22.2h |
| Sala de Reuniao (Monkey-Branch) | 10 | 2859 | ~13.8h |
| Anomalias de Transporte | 5 | 2196 | ~10.9h |
| Site QuietArt (marketing) | 1 | 2004 | ~7h |
| Rastreio de Container | 8 | 1933 | ~14.2h |
| Voda App | 2 | 298 | ~3h |
| Planilha Dashboard | 1 | 187 | ~1.5h |

### Por mes

| Mes | Commits | Linhas | Tempo est. |
|-----|---------|--------|------------|
| janeiro 2026 | 50 | 45652 | ~170.9h |
| fevereiro 2026 | 76 | 25955 | ~166.7h |
| março 2026 | 75 | 47359 | ~219.6h |
| abril 2026 | 99 | 84078 | ~279.5h |
| maio 2026 | 116 | 274578 | ~347.2h |
| junho 2026 | 47 | 85819 | ~149.2h |

---

## Detalhamento dia a dia

### domingo, 14/06/2026

**2 commits** | **3982 linhas** | **~14h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[f1c2658](https://github.com/JeniferBenites/FiscalMind/commit/f1c2658cbf4c40b83f3d29f19f547ebd8f86049f)** - feat: implement import simulation functionality with detailed calculations and UI form - Added `simulacaoImportacaoCalc.js` for handling import simulation calculations, including parsing input values ...
  - Linhas: **2530** (+2346/-184) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[e212b99](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/e212b99f0ee5713871b9867042caa3ce9c9cc018)** - feat: add fuel tank period summary and reading classification - Introduced new types for fuel tank period summary and daily breakdown. - Implemented `buildFuelTankPeriodSummary` to calculate inflow, o...
  - Linhas: **1452** (+1363/-89) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### sexta-feira, 12/06/2026

**9 commits** | **28397 linhas** | **~20.6h estimadas**

#### Sistema de Projetos Interno ("rodrigolessa1980/sistema-de-projetos-interno")

- **[74af52c](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/74af52c306b9e482212bfea5f5b98ffebbac27e0)** - Remove biome configuration and Playwright setup; update package.json scripts for build and type checking; streamline package dependencies and improve import paths for motion animations.
  - Linhas: **22180** (+7125/-15055) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[2575fcf](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/2575fcf83a3197a603750b306a0c8f4ceada46da)** - Update package-lock.json to add @emnapi/core and @emnapi/runtime as dev dependencies, restoring their peer relationships and ensuring consistency across optional packages. Remove unnecessary peer flag...
  - Linhas: **1** (+1/-0) | Tempo: **5-15 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[347d6c8](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/347d6c8ec0c121d443ed5a51e5a5e67d6712ec44)** - Add @emnapi/core and @emnapi/runtime as dev dependencies in package.json
  - Linhas: **84** (+70/-14) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[3015b1c](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/3015b1cf7d660962940fa6519f3cc866c5f86858)** - Update import path for Shadcn Tailwind CSS in globals.css
  - Linhas: **96** (+95/-1) | Tempo: **1-2 h**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

- **[6fbfd86](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/6fbfd8613d24238868dda15670e4163d1d8b417c)** - fix(backend): update Dockerfile to ignore npm scripts during installation Modified the Dockerfile to include the --ignore-scripts flag in the npm ci command, ensuring that the postinstall scripts do n...
  - Linhas: **3** (+2/-1) | Tempo: **5-15 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[8c8e387](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/8c8e3878ed166d961c73ad63aaf9c149ce25930c)** - Enhance Docker configuration and backend migration handling - Updated docker-compose.prod.yml to change the restart policy to 'unless-stopped' and added a healthcheck for the backend service. - Modifi...
  - Linhas: **88** (+81/-7) | Tempo: **1-2 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[11a39b2](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/11a39b2691d8cb64d2cd8fa8650e212380ab5fdb)** - Refactor environment variable handling and improve Docker configuration - Updated docker-compose.prod.yml to replace VITE_API_URL with NEXT_PUBLIC_API_URL and modified the service health check conditi...
  - Linhas: **158** (+100/-58) | Tempo: **1-2 h**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[e0c6e21](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/e0c6e2106ea69e4a3a72b149662593a4371a277d)** - Fix backend entry point and update deployment script for better error handling - Updated the backend entry point in docker-entrypoint.sh to point to the correct main file. - Modified package.json to r...
  - Linhas: **14** (+11/-3) | Tempo: **15-30 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[4b7efd5](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/4b7efd56608a0b63d86da71bf3b852fcb00c0e1f)** - feat(backend): add ProjectDemandAttachment model and update project schema - Introduced the ProjectDemandAttachment model to manage project demand-related files. - Updated the Project model to include...
  - Linhas: **5773** (+4989/-784) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quinta-feira, 11/06/2026

**2 commits** | **20723 linhas** | **~14h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[8f48fb0](https://github.com/rodrigolessa1980/controle-de-EPI/commit/8f48fb0055971b1c40ab0955da77dc7824588713)** - feat: enhance EPI management and improve user experience in the application - Updated index.html to include additional meta tags for better mobile support and theming. - Added new dependencies in pack...
  - Linhas: **18858** (+15250/-3608) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[62ac3d0](https://github.com/rodrigolessa1980/controle-de-EPI/commit/62ac3d09362023ea0e98b18f7bd97634bf5bbef9)** - refactor: enhance EPI uniqueness constraints and improve item name resolution - Updated the EPI model to enforce uniqueness on the combination of CA and name, improving data integrity. - Refactored it...
  - Linhas: **1865** (+1604/-261) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### quarta-feira, 10/06/2026

**2 commits** | **861 linhas** | **~5.8h estimadas**

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[543181a](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/543181af6567aa1efea41c0ae58205ab0a585614)** - Refactor deployment scripts to ensure ports are free before running containers
  - Linhas: **68** (+63/-5) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[eff2869](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/eff2869e0689bc0d45f3b35c64db3b79e566d155)** - feat: refactor OverviewTab to integrate FleetSummaryTable and remove deprecated components
  - Linhas: **793** (+249/-544) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### terça-feira, 09/06/2026

**5 commits** | **4756 linhas** | **~13h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[00bc594](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/00bc594e0dde33c1c278ae8e4e238944557c1ec1)** - feat: add Fuel Efficiency, Infraction Detail, Engine Hours, and Infractions Ranking components - Implemented FuelEfficiencySection to display fuel consumption metrics for trucks. - Created InfractionD...
  - Linhas: **4108** (+3934/-174) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[8e4b78f](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/8e4b78fe26334f02fa8ad49e8364367550a68daa)** - feat: add average engine hours per fleet per day metric to OverviewTab
  - Linhas: **38** (+36/-2) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Sistema de Projetos Interno ("rodrigolessa1980/sistema-de-projetos-interno")

- **[204a262](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/204a262a25052964ce70ddec882798165eecc34d)** - refactor: remove progress field from module definition in EpicsPage and update TaskRow to use Project type for projects
  - Linhas: **5** (+2/-3) | Tempo: **5-15 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[432f5cb](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/432f5cb3ca649e93182b72ce0f68ea3141b968f4)** - feat: add dependencyIds and tags fields to task creation dialog for enhanced task management
  - Linhas: **2** (+2/-0) | Tempo: **5-15 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[904f162](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/904f1624e96279a3d702cc5bd7fc0d76c65028e6)** - feat: enhance task management with urgency block handling and session synchronization - Added `ReleaseUrgencyBlocksUseCase` to manage the release of urgency blocks when tasks are updated or deleted. -...
  - Linhas: **603** (+440/-163) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### segunda-feira, 08/06/2026

**4 commits** | **1066 linhas** | **~6.8h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[eb09679](https://github.com/JeniferBenites/FiscalMind/commit/eb096793a782db7ab5d1a6fbf19018b0fa837368)** - Refactor IA service calls to use chamarMotorIAComJSON instead of chamarClaudeComJSON; update logic for price calculations and filtering in pesquisaBrasil, pesquisaEmbalagem, pesquisaFabricas, pesquisa...
  - Linhas: **952** (+592/-360) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### Sala de Reuniao (Monkey-Branch) ("Monkey-Branch/SalaDeReuniao")

- **[163bb85](https://github.com/Monkey-Branch/SalaDeReuniao/commit/163bb85f1ab7f82779a2d2afc033dbc3b3fecf06)** - Implement admin notification for new user registrations - Added functionality to notify administrators upon new user registration. - Removed the email confirmation process, which was previously disabl...
  - Linhas: **108** (+88/-20) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### Site QuietArt (marketing) ("RafaelFett/quietart2")

- **[08b6f91](https://github.com/RafaelFett/quietart2/commit/08b6f91d2ab600d9596fa039ba25fb9c951e1860)** - Update contact phone number in call-to-action links
  - Linhas: **4** (+2/-2) | Tempo: **5-15 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[b477ca7](https://github.com/RafaelFett/quietart2/commit/b477ca77c8d936a305ef0307c2a2d71830a39d2e)** - Update location from Itaja├¡ to Cambori├║ in App component
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### sexta-feira, 05/06/2026

**10 commits** | **10875 linhas** | **~36.4h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[eb0024e](https://github.com/JeniferBenites/FiscalMind/commit/eb0024e01200c15e58375e8fbf6a5bdb2985da0a)** - feat: tabelas fiscais DB-only + painel de bases em Configuracoes - Tabelas oficiais (TIPI/II-TEC/CEST/NCM) e ST agora sao DB-only: leitura so do banco, sem fallback de disco; o sync para de gravar arq...
  - Linhas: **1049** (+672/-377) | Tempo: **6-8 h+**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[de070d6](https://github.com/JeniferBenites/FiscalMind/commit/de070d68746c455b7d2ab04eae89a97b5cdb5c08)** - merge: origin/main (rebrand "Fluxograma de Produto" + active state/pricing) com DB-only Conflitos resolvidos (mantendo a l├│gica DB-only + o rebrand do colaborador): - cestTableService/tipiTableServic...
  - Linhas: **1950** (+1821/-129) | Tempo: **6-8 h+**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[41a62ec](https://github.com/JeniferBenites/FiscalMind/commit/41a62ecd4da5426be3685ab5b52769d20b2bd670)** - feat: add deterministic packaging recalculation and product dimension persistence - Implemented a new endpoint to recalculate packaging dimensions based on user input and save them to the product. - E...
  - Linhas: **655** (+408/-247) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[55590b9](https://github.com/JeniferBenites/FiscalMind/commit/55590b9ba5118b90f2b77e86ff474b7aba9fc36f)** - feat: implement deterministic ST calculations and enhance data source validation across multiple services
  - Linhas: **372** (+284/-88) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[aec68e8](https://github.com/JeniferBenites/FiscalMind/commit/aec68e85f1a3fb374b183048027a22256a423e7b)** - feat: update data source to 'dados_fabricante' for packaging calculations and results
  - Linhas: **12** (+6/-6) | Tempo: **15-30 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Site QuietArt (marketing) ("RafaelFett/quietart2")

- **[84e80a7](https://github.com/RafaelFett/quietart2/commit/84e80a756b42ebabbbb8556935b72913e41105cd)** - Consolida imagens em src/assets e remove pasta assets da raiz. As imagens usadas pelo app ja estavam em src/assets/branding; a pasta assets na raiz era duplicata e ficava fora da estrutura do projeto....
  - Linhas: **0** (+0/-0) | Tempo: **5-15 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[2e03824](https://github.com/RafaelFett/quietart2/commit/2e03824f4caf284352b9d6bb317cde65a5750dda)** - Refactor image handling by consolidating assets into src/assets and removing the redundant assets folder from the root directory. This streamlines the project structure and eliminates duplication.
  - Linhas: **78** (+78/-0) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[8807d22](https://github.com/RafaelFett/quietart2/commit/8807d227cfe583a0d666f2e7750bc0a38471785b)** - Merge pull request #1 from RafaelFett/parte-1-layout Parte 1 layout
  - Linhas: **906** (+668/-238) | Tempo: **4-6 h**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[9b42d98](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/9b42d98373f244312ba2f9e8050f9af81a7b1dad)** - feat: enhance fuel management with new tank monitoring and vehicle catalog features - Added new models for FuelTankLevelSnapshot and FuelTankLoadEvent to track fuel levels and load events. - Implement...
  - Linhas: **5845** (+4777/-1068) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Sistema de Projetos Interno ("rodrigolessa1980/sistema-de-projetos-interno")

- **[73cd117](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/73cd117fe6ab1e1ea442c2fc615aafd989e619cf)** - chore: update .gitignore to explicitly include .env file and exclude .env* pattern
  - Linhas: **8** (+7/-1) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### quarta-feira, 03/06/2026

**3 commits** | **4918 linhas** | **~7.9h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[c8dbe13](https://github.com/JeniferBenites/FiscalMind/commit/c8dbe13e0eb4c97fe9bc952150cfe512cffc58fb)** - feat: update Docker Compose and deployment workflow for fluxograma-produtos - Added project name to Docker Compose configuration. - Enhanced deployment workflow to include project-specific artifact pr...
  - Linhas: **4860** (+4570/-290) | Tempo: **6-8 h+**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[3c909b2](https://github.com/JeniferBenites/FiscalMind/commit/3c909b20d16596a20bc7acbb58367a4ff8cd91b4)** - feat(redis): improve Redis service management and port verification - Added function to check if Redis host port is published on the host. - Refactored Redis startup logic to handle cases where the co...
  - Linhas: **57** (+47/-10) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[0808817](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/0808817f65775d36228702677b6cde17fce78c94)** - aaaa
  - Linhas: **1** (+1/-0) | Tempo: **5-15 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### terça-feira, 02/06/2026

**10 commits** | **10241 linhas** | **~30.7h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[d460fa0](https://github.com/JeniferBenites/FiscalMind/commit/d460fa0d9e36b84523216b68f51c143c370a3858)** - feat(validacao): subsistema ST + funda├º├úo de proveni├¬ncia + ST determin├¡stica nos documentos Etapa 3 (Valida├º├úo) ÔÇö integridade de dados (PLANO_INTEGRIDADE_DADOS_VALIDACAO.md): ST (Substitui├º├...
  - Linhas: **3928** (+3917/-11) | Tempo: **6-8 h+**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[93c3e45](https://github.com/JeniferBenites/FiscalMind/commit/93c3e45d42b7e1dbc3cdb2e42e41b84348c6a1cc)** - merge: integra origin/main (cat├ílogo/tradu├º├úo/pricing) com integridade ST+proveni├¬ncia Conflito resolvido em server/lib/fileStorage.js (DB_SCOPES): uni├úo dos escopos ÔÇö mant├®m 'catalog-amostras...
  - Linhas: **3354** (+3042/-312) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[7c8ae6a](https://github.com/JeniferBenites/FiscalMind/commit/7c8ae6a223d463424e751d5ae4366004518c70f3)** - feat(validacao): proveni├¬ncia fiscal + ┬º7 com evid├¬ncias reais (Fase 2.C/2.D) Bloco 2.C ÔÇö proveni├¬ncia dos tributos (aditivo, n├úo muda valores/estrutura): - provenienciaFiscal.js: matriz do con...
  - Linhas: **177** (+177/-0) | Tempo: **1-2 h**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[5171b35](https://github.com/JeniferBenites/FiscalMind/commit/5171b3561799aadca4c66251ccc499aa12a848c2)** - feat(validacao): add ProvenanceBadges component to display data provenance in validation stage feat: update docker-compose to expose Redis on loopback for local access feat: implement endpoint for dat...
  - Linhas: **440** (+410/-30) | Tempo: **2-4 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[e7bc77d](https://github.com/JeniferBenites/FiscalMind/commit/e7bc77d2af428a64ddb75cb17104416f7fa845fc)** - Merge branch 'main' of https://github.com/JeniferBenites/FiscalMind
  - Linhas: **1962** (+1896/-66) | Tempo: **6-8 h+**
  - Impacto: Produto fiscal/IA - avanco em automacao ou inteligencia do sistema.

- **[e7034bf](https://github.com/JeniferBenites/FiscalMind/commit/e7034bf78750cd0721ae8f6989e62e5d148b9a6f)** - feat(deploy): enhance post-deploy cleanup by removing old and dangling images
  - Linhas: **28** (+28/-0) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[2b43056](https://github.com/JeniferBenites/FiscalMind/commit/2b4305699c3e51bd115faa5aebd755bef024f487)** - feat(redis): enhance Redis integration for local development and error handling - Updated Docker Compose to start Redis service conditionally. - Modified package.json scripts to include a no-Redis opt...
  - Linhas: **293** (+267/-26) | Tempo: **2-4 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

#### Sala de Reuniao (Monkey-Branch) ("Monkey-Branch/SalaDeReuniao")

- **[0c465f0](https://github.com/Monkey-Branch/SalaDeReuniao/commit/0c465f0e9c0c275a4087e0566d0029a05bfa26cd)** - Update environment and deployment documentation for API configuration - Added a note in .env.example regarding backend API usage in development and production environments. - Clarified the usage of VI...
  - Linhas: **29** (+27/-2) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[3fcfa4f](https://github.com/Monkey-Branch/SalaDeReuniao/commit/3fcfa4fb2798318e849fee9a6ae97262644b7d6f)** - Enhance deployment workflow by ensuring port availability before container startup - Added commands to remove any existing containers using the frontend and backend ports to ensure they are free befor...
  - Linhas: **6** (+6/-0) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[b119b67](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/b119b67f4195e3dc59a9d9257a06f7a04009b407)** - Update deploy.yml to reflect new image names for frontend and backend - Changed image names from 'agenda-sala-reuniao-frontend' and 'agenda-sala-reuniao-backend' to 'sala-reuniao-frontend' and 'sala-r...
  - Linhas: **24** (+12/-12) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

---

### sexta-feira, 29/05/2026

**16 commits** | **35957 linhas** | **~36.9h estimadas**

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[b24962e](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/b24962e73219791037efef78e030f8cece3b9f2c)** - Refactor CountdownPage layout for enhanced responsiveness - Modified height and width properties to ensure full viewport coverage and consistent layout. - Implemented min() function for improved respo...
  - Linhas: **1** (+1/-0) | Tempo: **5-15 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[56f3f65](https://github.com/rodrigolessa1980/controle-de-EPI/commit/56f3f65d36aaa8de1a2273acdcbee3bcd4b2df31)** - feat: enhance permission checks and EPI handling in Compras component - Updated permission checks to include stock read permissions, ensuring users have appropriate access. - Refactored EpiCategorySel...
  - Linhas: **1273** (+921/-352) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[3539d53](https://github.com/rodrigolessa1980/controle-de-EPI/commit/3539d53930f9ede5e6b786b73e622de98332c988)** - fix: improve git permission handling and fetch logic in backend-docker workflow - Added checks for write permissions on the .git directory to prevent deployment failures due to permission issues. - En...
  - Linhas: **323** (+167/-156) | Tempo: **2-4 h**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[339ffbd](https://github.com/rodrigolessa1980/controle-de-EPI/commit/339ffbd177522218b36dcbae1b47d38efeb75336)** - chore: update backend-docker workflow for improved permissions and checkout step - Added permissions for read access to contents, enhancing security and access control. - Included a checkout step usin...
  - Linhas: **5** (+5/-0) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[793f933](https://github.com/rodrigolessa1980/controle-de-EPI/commit/793f93346e5ae12d9425928ff798ac2fd5ac6f78)** - feat: implement automatic EPI creation and enhance CA handling in Compras and routes - Added logic to automatically create EPIs for items with CA but without linked EPI in the Compras component, impro...
  - Linhas: **1475** (+1286/-189) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[c1f02da](https://github.com/rodrigolessa1980/controle-de-EPI/commit/c1f02da7e5be8ff72a1c9b9a060362802384269f)** - fix: improve error handling and environment configuration in deploy script - Added error handling to the deploy script to provide clearer feedback on deployment failures, including line number and com...
  - Linhas: **11** (+10/-1) | Tempo: **15-30 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

#### Sistema de Projetos Interno ("rodrigolessa1980/sistema-de-projetos-interno")

- **[4ce2c58](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/4ce2c58d2c9256aabe88a9d77d12fe6e49b62174)** - chore: clean up dist directory by removing generated files and updating .gitignore - Deleted various generated files from the dist directory, including Prisma configuration and entity files. - Updated...
  - Linhas: **28890** (+2314/-26576) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[b2c8c6a](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/b2c8c6a6edcdeaf522166f9bc5bbca36cef2983a)** - chore: update API and server configurations for local development - Changed API URL in frontend and backend configurations to use port 4011. - Updated Playwright configuration to reflect the new base ...
  - Linhas: **376** (+364/-12) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[5aece67](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/5aece674b4198f6fc93ce8b977404bd062aed58c)** - chore: update package-lock and package.json with new dependencies - Added optional dependencies for @emnapi/core and @emnapi/runtime in both package-lock.json and package.json. - Updated various depen...
  - Linhas: **3502** (+2341/-1161) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[2c6f098](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/2c6f098bec52c207f41a8909dc22586f51177944)** - fix: corrigir build Docker do backend com lock file dessincronizado Substitui npm ci por npm install nos Dockerfiles e adiciona .npmrc com optional=false para evitar falha por dependencias opcionais a...
  - Linhas: **25** (+11/-14) | Tempo: **15-30 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[7c25238](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/7c25238aa9a0dffde40b303dd45aaa6c3e01e1cb)** - fix: usar env dummy no build Docker para prisma generate Co-authored-by: Cursor <cursoragent@cursor.com>
  - Linhas: **8** (+8/-0) | Tempo: **15-30 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[603110d](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/603110d3d44550a237f456f08cd17a5cc1e2a0a6)** - fix: injetar backend/.env real no build Docker via BuildKit secret Co-authored-by: Cursor <cursoragent@cursor.com>
  - Linhas: **37** (+26/-11) | Tempo: **30-60 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[a325d7f](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/a325d7f4f7a751d82cf137caf75ee6fc964a558f)** - docs: documentar injecao de backend/.env no build Docker Co-authored-by: Cursor <cursoragent@cursor.com>
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[1128692](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/11286925805aa2b666e5c60d37df0faed4ca5fb9)** - fix: instalar deps opcionais do lightningcss no build Docker do frontend Co-authored-by: Cursor <cursoragent@cursor.com>
  - Linhas: **5** (+2/-3) | Tempo: **5-15 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[b8e44b6](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/b8e44b6e7a422927f82d6fd11b464f31d70aeb11)** - fix: definir now em logTime para corrigir build de producao Co-authored-by: Cursor <cursoragent@cursor.com>
  - Linhas: **1** (+1/-0) | Tempo: **5-15 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[c6b1456](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/c6b1456307fe97d3950d0ff6c67f0990ee0a0526)** - ci: validar build do frontend antes do deploy automatico Co-authored-by: Cursor <cursoragent@cursor.com>
  - Linhas: **23** (+23/-0) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

---

### quinta-feira, 28/05/2026

**9 commits** | **7898 linhas** | **~36.4h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[47fdbd7](https://github.com/JeniferBenites/FiscalMind/commit/47fdbd7dcd985d378486d9685e0925ed6f1e9577)** - feat: add API fallbacks documentation and update .env.example - Introduced comprehensive documentation for API fallbacks in `API_FALLBACKS.md`, detailing fallback behaviors and risks for various field...
  - Linhas: **619** (+609/-10) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[6e7e183](https://github.com/JeniferBenites/FiscalMind/commit/6e7e183bb08e0833d1092894443677edc6d924fe)** - refactor: update SISCOMEX certificate environment variable names for clarity and compatibility - Renamed environment variables for e-CNPJ certificate configuration to SISCOMEX_ECNPJ_CERT_* for better ...
  - Linhas: **23** (+12/-11) | Tempo: **15-30 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[62cf079](https://github.com/JeniferBenites/FiscalMind/commit/62cf0790be14c268f104f132022a6ff1755ae6c0)** - Merge branch 'main' of https://github.com/JeniferBenites/FiscalMind
  - Linhas: **1311** (+1287/-24) | Tempo: **6-8 h+**
  - Impacto: Produto fiscal/IA - avanco em automacao ou inteligencia do sistema.

- **[0aa35c0](https://github.com/JeniferBenites/FiscalMind/commit/0aa35c0f14cb6deda1cdad531cc5e32ad50646dc)** - feat: implement IA integration for product request form and add usage tracking
  - Linhas: **460** (+452/-8) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[6fbead8](https://github.com/JeniferBenites/FiscalMind/commit/6fbead8519707437643995069848d2b8aee02857)** - merge: integrar branch remota + corrigir setToast com objeto em ValidationPage - Resolve conflito em ValidationPage.jsx mantendo onFlowRefresh + toast como string - Corrige crash "Objects are not vali...
  - Linhas: **262** (+217/-45) | Tempo: **2-4 h**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[d514ae3](https://github.com/JeniferBenites/FiscalMind/commit/d514ae3efe3adb9cb2a6a03ae086d8e0a00c8679)** - feat: enhance IA usage tracking and budget management - Added new environment variable MOTOR_IA_USD_BRL for estimated expense conversion. - Implemented functions to parse environment variables and que...
  - Linhas: **793** (+689/-104) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[fefd75d](https://github.com/JeniferBenites/FiscalMind/commit/fefd75d892da577a8121522ecb0fa6aa4db6e939)** - Merge branch 'main' of https://github.com/JeniferBenites/FiscalMind
  - Linhas: **364** (+301/-63) | Tempo: **2-4 h**
  - Impacto: Produto fiscal/IA - avanco em automacao ou inteligencia do sistema.

- **[ecd3f99](https://github.com/JeniferBenites/FiscalMind/commit/ecd3f99dfc3f3182102133b96fe267983f1f2557)** - refactor: update Dockerfile and enhance Siscomex API integration - Changed base image in Dockerfile from `node:20-alpine` to `node:20-bookworm-slim` for improved performance and security. - Added inst...
  - Linhas: **3609** (+3300/-309) | Tempo: **6-8 h+**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[18e4db4](https://github.com/JeniferBenites/FiscalMind/commit/18e4db416a002ae1acd633f0b6d6b13b1909588a)** - docs: enhance documentation for Siscomex API and validation process - Added technical documentation references in CLAUDE.md for better clarity on validation stages and associated files. - Updated API_...
  - Linhas: **457** (+452/-5) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quarta-feira, 27/05/2026

** commits** | **31 linhas** | **~0.8h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[48d673a](https://github.com/JeniferBenites/FiscalMind/commit/48d673a24ebad6938eb1ea3e6fd83cb53625fa13)** - fix(security): move IBPT credentials to environment variables Remove hardcoded IBPT token/CNPJ from service code and document API purpose plus source download URLs in .env.example to prevent credentia...
  - Linhas: **31** (+24/-7) | Tempo: **30-60 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

---

### terça-feira, 26/05/2026

**19 commits** | **17804 linhas** | **~49.8h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[516b8ea](https://github.com/JeniferBenites/FiscalMind/commit/516b8ea16fbeb3ae48215a3b99f2b79e8ac986b6)** - feat: integrate OpenFiscal as third service in deploy stack - Add openfiscal/ directory (facitysistemas/OpenFiscal, .git removed so repo tracks it) - Dockerfile.openfiscal: Node 20 Alpine with build t...
  - Linhas: **7161** (+7153/-8) | Tempo: **6-8 h+**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[86461c2](https://github.com/JeniferBenites/FiscalMind/commit/86461c286fe3ccb5bcb420424556b3fcac26308f)** - feat: add mTLS support for Siscomex TTCE and TALP endpoints - siscomexConfig.js: add SISCOMEX_CERT_BASE64 and SISCOMEX_CERT_PATH vars - siscomexClient.js: replace bare fetch with undici Agent when cer...
  - Linhas: **761** (+745/-16) | Tempo: **4-6 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[0b12c3f](https://github.com/JeniferBenites/FiscalMind/commit/0b12c3fdd0ec6b8cd69b8ff11b7c3fb23a062384)** - fix: remove openfiscal from default deploy stack OpenFiscal added 3+ min to CI/CD build (npm ci compiles better-sqlite3 from source) and crashed deploy on healthcheck failure. The backend already has:...
  - Linhas: **21** (+11/-10) | Tempo: **15-30 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[6843ce0](https://github.com/JeniferBenites/FiscalMind/commit/6843ce0bb5fd6f4a1d21b40fdd42452a366572e0)** - chore: remove OpenFiscal entirely Was not rendering anything in the frontend, added 3+ min to CI/CD build (native compilation of better-sqlite3), and crashed deploy on healthcheck. All data it provide...
  - Linhas: **4966** (+107/-4859) | Tempo: **6-8 h+**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[abd7cee](https://github.com/JeniferBenites/FiscalMind/commit/abd7ceeb62b73b507e466969aaec2b5cf7e52c06)** - fix: remove all invented fiscal data fallbacks Never invent data ÔÇö if we don't have it, return null. - fiscalReferenceService.js: remove hardcoded ICMS defaults { SC: 12, PR: 12, RS: 12 }. If UF has...
  - Linhas: **34** (+3/-31) | Tempo: **30-60 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[d81a5fb](https://github.com/JeniferBenites/FiscalMind/commit/d81a5fb23ded521418ed17790363abf301cadb4f)** - feat: add PPB and TTD 409 fields to ncm_analyses; fix SC ICMS rate Item 1 ÔÇö Fix south_states ICMS SC: migration corrects SC from 12% to 17% (standard import rate). TTD 409 benefit (1.4%) is a separa...
  - Linhas: **52** (+48/-4) | Tempo: **30-60 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[c02ee59](https://github.com/JeniferBenites/FiscalMind/commit/c02ee59d3184eafa2d4d4ff98832cb07bd780e17)** - fix: correct PPB disclaimer ÔÇö benefit is company-level, not product-level PPB (Lei de Informatica) is not automatic per product. It is granted to the importing/manufacturing company via MCTI portari...
  - Linhas: **7** (+4/-3) | Tempo: **15-30 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[f03a708](https://github.com/JeniferBenites/FiscalMind/commit/f03a7083e424bf1a9c0ef570e1eaca540c2c0692)** - chore: remove PPB field ÔÇö not applicable to this company Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>
  - Linhas: **34** (+7/-27) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[1c8029a](https://github.com/JeniferBenites/FiscalMind/commit/1c8029afac184ed1822fe66065b94e0308da32aa)** - refactor: update tax line descriptions and notes for PIS/COFINS in pricing prefill service - Adjusted source type and description for PIS/COFINS to clarify that they are standard estimates and not uni...
  - Linhas: **21** (+15/-6) | Tempo: **15-30 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[1b46a00](https://github.com/JeniferBenites/FiscalMind/commit/1b46a00c8b5eb936cafbffd63976c2fd363811fc)** - feat: add IBPT NCM model and related routes for IBPT metadata and CSV import - Introduced a new model `IbptNcm` in the Prisma schema to handle IBPT tax data. - Implemented routes for testing IBPT conn...
  - Linhas: **517** (+500/-17) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[36d3185](https://github.com/JeniferBenites/FiscalMind/commit/36d3185a99b8b075456a0d7a7dca61928514de85)** - refactor: update category input to use datalist for better user experience and enhance NCM suggestion source note styling
  - Linhas: **95** (+57/-38) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[a0f6452](https://github.com/JeniferBenites/FiscalMind/commit/a0f6452a175190ce70223c4b5ad594b7c64538e9)** - chore: test Actions trigger after GitHub outage Co-authored-by: Cursor <cursoragent@cursor.com>
  - Linhas: **0** (+0/-0) | Tempo: **5-15 min**
  - Impacto: Qualidade - aumenta confianca em regressoes e releases.

- **[2f4b9a4](https://github.com/JeniferBenites/FiscalMind/commit/2f4b9a46be801c6824c4cbfd1cce1e0268f27a52)** - fix(ci): use native SSH in deploy workflow to avoid action download failures Co-authored-by: Cursor <cursoragent@cursor.com>
  - Linhas: **168** (+96/-72) | Tempo: **1-2 h**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

#### Sala de Reuniao (Monkey-Branch) ("Monkey-Branch/SalaDeReuniao")

- **[ff78573](https://github.com/Monkey-Branch/SalaDeReuniao/commit/ff785736f41d9971bf7bf5a58cf882d4b525dee6)** - Enhance deployment workflow with Nginx reverse proxy and Docker Compose configuration - Added Nginx reverse proxy configuration to handle API and frontend requests. - Introduced a Docker Compose file ...
  - Linhas: **136** (+122/-14) | Tempo: **1-2 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[8a60287](https://github.com/Monkey-Branch/SalaDeReuniao/commit/8a60287cad5c193ec76643bc4098c11b4aa7b5ce)** - Refactor SMTP_FROM variable assignment in deployment workflow - Changed the method of assigning the SMTP_FROM variable in the deploy.yml file from echo to printf for improved formatting consistency.
  - Linhas: **4** (+2/-2) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[5082d10](https://github.com/Monkey-Branch/SalaDeReuniao/commit/5082d1008b1795ae4d505af168fb9514fe2cbd66)** - Enhance deployment workflow and authentication logic - Updated the deployment workflow to include SSL certificate management using Certbot and Nginx configuration for HTTPS. - Refactored the authentic...
  - Linhas: **2412** (+1765/-647) | Tempo: **6-8 h+**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[faa6022](https://github.com/Monkey-Branch/SalaDeReuniao/commit/faa6022c5a1729e69381c468a95e1f90c22d2ff7)** - Refactor SSL certificate management in deployment workflow - Updated the deployment workflow to utilize Docker for Certbot, eliminating the need for local installation. - Enhanced domain extraction lo...
  - Linhas: **74** (+48/-26) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[00e896a](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/00e896a85337d8c27e57bd8b365efbe052acaedc)** - feat: add LHG export and reconciliation endpoints with XLSX support - Implemented new API endpoints for exporting LHG data, including detailed reconciliation of canhotos in LHG and their union with LH...
  - Linhas: **1109** (+967/-142) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[e707535](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/e7075352f54b4fca103263ccb219f2550209a53d)** - fix: update PeriodFilter component to use date input for month selection - Changed input type from 'month' to 'date' to allow for better compatibility with date handling. - Adjusted value formatting t...
  - Linhas: **232** (+228/-4) | Tempo: **2-4 h**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

---

### segunda-feira, 25/05/2026

**4 commits** | **74740 linhas** | **~10.3h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[ebd635b](https://github.com/JeniferBenites/FiscalMind/commit/ebd635b2464df71b33cd2c884052c0d203888329)** - feat: export computeSlaStatus alongside BUILTIN_SLA_DEFAULTS in slaService
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[83c569f](https://github.com/JeniferBenites/FiscalMind/commit/83c569f731bd78ec5aa9a89e50f6fa204ab4cc86)** - debug: log server-side 500 errors and expose detail in client error messages Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>
  - Linhas: **5** (+4/-1) | Tempo: **5-15 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[e2e5bb9](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/e2e5bb9e51a97c9accca7b82d76a6195d21c5e4c)** - feat: enhance LHG import functionality with carrier sanitization and fleet ownership resolution - Added carrier sanitization logic to the LHG import process, filtering out disallowed carriers and prov...
  - Linhas: **488** (+470/-18) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### Sistema de Projetos Interno ("rodrigolessa1980/sistema-de-projetos-interno")

- **[e353db8](https://github.com/rodrigolessa1980/sistema-de-projetos-interno/commit/e353db85f0fb1e325a37054ccfbba38b4f7dc4d5)** - Update package-lock.json: Added "peer" property to several dependencies and removed "libc" entries for improved compatibility and clarity.
  - Linhas: **74245** (+74083/-162) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### domingo, 24/05/2026

**3 commits** | **26588 linhas** | **~14.2h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[95159d3](https://github.com/JeniferBenites/FiscalMind/commit/95159d335f554dddbdc477163c61899366db93cd)** - feat: enhance product filtering and sorting capabilities - Added functions for normalizing product status filters and parsing product stages. - Implemented sorting logic for product queries, allowing ...
  - Linhas: **2862** (+2333/-529) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[42efe67](https://github.com/JeniferBenites/FiscalMind/commit/42efe67a65e29f994ca27eeb83cb57570892d278)** - fix: update dev script to ensure proper termination of processes - Modified the "dev" script in package.json to include --kill-others and --kill-others-on-fail options for concurrently, ensuring that ...
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[113c4df](https://github.com/JeniferBenites/FiscalMind/commit/113c4df9b404547d141486ca740ccd56b6ce47e1)** - feat: add custom hooks and context providers for status messages and SLA configuration - Introduced `useStatusMessage` hook for managing status messages in components. - Created `SlaConfigContext` and...
  - Linhas: **23724** (+14427/-9297) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### sexta-feira, 22/05/2026

**14 commits** | **82227 linhas** | **~45.2h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[516b026](https://github.com/JeniferBenites/FiscalMind/commit/516b026d82c57cbaaffdfc203c39ad09ed3ccb9c)** - refactor: rename project from FiscalMind to Fluxograma de Produtos and update related configurations - Updated project name and references throughout the codebase to reflect the new branding. - Change...
  - Linhas: **12582** (+10722/-1860) | Tempo: **6-8 h+**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[8d5c219](https://github.com/JeniferBenites/FiscalMind/commit/8d5c2195a8e9cdf2729f8b8760bef90cbdc98559)** - chore: update dependencies and enhance server configuration - Added new dependencies: `@tanstack/react-query`, `compression`, and `multer` to improve data handling and performance. - Updated `.gitigno...
  - Linhas: **64963** (+63487/-1476) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[fc9a293](https://github.com/JeniferBenites/FiscalMind/commit/fc9a293d7c91f77913141ea86d549310c516451c)** - chore: add shared directory to backend and frontend Dockerfiles - Included the `shared` directory in both `Dockerfile.backend` and `Dockerfile.frontend` to ensure shared resources are available during...
  - Linhas: **2** (+2/-0) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[39530a9](https://github.com/JeniferBenites/FiscalMind/commit/39530a9033c9af74e99271b26275df40246aa339)** - chore: update deploy workflow to include service stop command - Added `docker compose stop -t 30 backend frontend` to the deployment workflow to ensure services are gracefully stopped before rebuildin...
  - Linhas: **1** (+1/-0) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[dfa53cc](https://github.com/JeniferBenites/FiscalMind/commit/dfa53cc175f3f741378e864eee22da8728e3699f)** - chore: enhance deployment workflow to ensure proper service shutdown - Updated the deployment workflow to include additional commands for stopping and removing Docker containers associated with the ba...
  - Linhas: **15** (+14/-1) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[b260ab9](https://github.com/JeniferBenites/FiscalMind/commit/b260ab9d54746a998c49fcd7ef88650d27cd1513)** - chore: improve deployment script for enhanced error handling and cleanup - Updated the deployment workflow to include a shebang and set stricter error handling with `set -euo pipefail`. - Added cleanu...
  - Linhas: **12** (+9/-3) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[121cc83](https://github.com/JeniferBenites/FiscalMind/commit/121cc8347b6fd2bcee3cef87de6d43e95b0cca74)** - refactor: improve product retrieval and NCM analysis serialization - Updated `getProduct` function to ensure numeric ID validation and consistent type handling for product lookups. - Enhanced `createF...
  - Linhas: **396** (+336/-60) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[98a3280](https://github.com/JeniferBenites/FiscalMind/commit/98a32803586d4248294318769b19751656e498c8)** - chore: update environment configuration for deployment and frontend API URL - Enhanced `.env.example` and `server/.env.example` to clarify the optional use of `MYSQL_HOST` for public API URLs. - Modif...
  - Linhas: **111** (+93/-18) | Tempo: **1-2 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[7379c08](https://github.com/rodrigolessa1980/controle-de-EPI/commit/7379c08aef9bc0b4c8f470b34573f9c0ed1b763b)** - feat: enhance EPI handling and filtering across components - Updated EPI data structures to include size and CA attributes, improving item detail representation. - Refactored item display logic in Fic...
  - Linhas: **1045** (+875/-170) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[ef2a389](https://github.com/rodrigolessa1980/controle-de-EPI/commit/ef2a3895fbc25b2ce0139b24cb0dbc27f099d4c4)** - refactor: remove unused getEPIDisplayLabel function in Estoque component - Eliminated the getEPIDisplayLabel function, streamlining the code and improving maintainability. - This change focuses on enh...
  - Linhas: **264** (+256/-8) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[d9eaaaa](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/d9eaaaaf2ff87d15da79025686ed65cf5433cc59)** - feat: add vehicle positions purge functionality and related tests - Introduced new API endpoint for triggering vehicle positions maintenance, including error handling for improved reliability. - Added...
  - Linhas: **938** (+937/-1) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[2d48c51](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/2d48c515c5b86e701129d49170256d1b7a84f7ae)** - feat: add rolling 7-day fuel consumption endpoint and related functionality - Introduced a new API endpoint for fetching rolling 7-day depot fuel consumption, including caching mechanisms for improved...
  - Linhas: **871** (+746/-125) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### ExpediÃ§Ã£o ("rodrigolessa1980/expedicao")

- **[625e874](https://github.com/rodrigolessa1980/expedicao/commit/625e874174ad495cfb734b0cd84298c0b88e3ea2)** - feat: enhance App and PedidosTable components with internal deadline tracking and visual indicators for order timelines
  - Linhas: **978** (+756/-222) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[1442e95](https://github.com/rodrigolessa1980/expedicao/commit/1442e95951a055b58ec5704862089b280b567027)** - feat: update App, PedidosTable, and DashboardPage components to support conditional display of internal deadlines based on user roles
  - Linhas: **49** (+30/-19) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quinta-feira, 21/05/2026

**12 commits** | **5388 linhas** | **~33.8h estimadas**

#### FiscalMind (IA fiscal) ("JeniferBenites/FiscalMind")

- **[5f6d028](https://github.com/JeniferBenites/FiscalMind/commit/5f6d028209c7aa23f3cb1830418d033d5ac0ed40)** - refactor: migrate from SQL to Prisma ORM for product and south analysis repositories - Removed SQL queries and replaced them with Prisma Client methods in productRepository.js and southRepository.js. ...
  - Linhas: **2207** (+1756/-451) | Tempo: **6-8 h+**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[1247247](https://github.com/JeniferBenites/FiscalMind/commit/1247247f2b44471785ca1b1f7b1488dc0b26ecab)** - docs: update architecture and README for business flow and mandatory documentation - Added reference to the business flow documentation in ARCHITECTURE.md, outlining the proposed schema, endpoints, an...
  - Linhas: **869** (+688/-181) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[6f3080d](https://github.com/JeniferBenites/FiscalMind/commit/6f3080dfcc30e4d599eb7e7fbf0662596ad3801f)** - docs: update authentication and authorization details in FLUXO_COMERCIAL.md - Expanded the authentication section to include JWT session management with access and refresh tokens. - Introduced a new U...
  - Linhas: **356** (+269/-87) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[75e62d9](https://github.com/JeniferBenites/FiscalMind/commit/75e62d93999b76545339c6699460dc60d3ba044d)** - chore: update API and client port configurations to 4115 - Changed VITE_API_URL in .env.example and README.md to reflect the new API endpoint. - Updated health check and metrics URLs in ARCHITECTURE.m...
  - Linhas: **242** (+228/-14) | Tempo: **2-4 h**
  - Impacto: Documentacao - facilita onboarding e operacao.

- **[5540436](https://github.com/JeniferBenites/FiscalMind/commit/5540436d25b759bcc790b5882d2587970cc7257d)** - fix: update docker-compose env_file syntax for clarity
  - Linhas: **7** (+4/-3) | Tempo: **15-30 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[d5f40a5](https://github.com/JeniferBenites/FiscalMind/commit/d5f40a58d3872999d1e546295c36783d15adb1ee)** - chore: reorganize package.json and package-lock.json for better dependency management - Moved dependencies to the appropriate sections in package.json. - Added new devDependencies including Playwright...
  - Linhas: **101** (+87/-14) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[e89338a](https://github.com/JeniferBenites/FiscalMind/commit/e89338a6f3ade8666291ae289b37da2992f020c4)** - chore: add @emnapi/core and @emnapi/runtime as devDependencies - Included @emnapi/core and @emnapi/runtime version 1.10.0 in package.json and package-lock.json. - Updated node_modules entries for both...
  - Linhas: **32** (+27/-5) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[f4fa973](https://github.com/JeniferBenites/FiscalMind/commit/f4fa973b6728286d3aadef354e7e68abe0473ec8)** - fix: correct import statement and connection creation for mariadb
  - Linhas: **4** (+2/-2) | Tempo: **5-15 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[e7f7fe4](https://github.com/JeniferBenites/FiscalMind/commit/e7f7fe4d60e0b063f9eac1df3147e8d6ac1d17cb)** - Merge branch 'main' of https://github.com/JeniferBenites/FiscalMind
  - Linhas: **92** (+51/-41) | Tempo: **1-2 h**
  - Impacto: Produto fiscal/IA - avanco em automacao ou inteligencia do sistema.

#### ExpediÃ§Ã£o ("rodrigolessa1980/expedicao")

- **[c803d21](https://github.com/rodrigolessa1980/expedicao/commit/c803d21395f5c9c3b21faa6d077e5609be1cbbf5)** - feat: implement webhook notification for overdue orders and enhance order management with new fields and job scheduling
  - Linhas: **1007** (+963/-44) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[9f28d24](https://github.com/rodrigolessa1980/expedicao/commit/9f28d24edfe7c8887124973613f00670ba9796dc)** - feat: add regiao field to Pedido model and enhance order management components for improved regional tracking and validation
  - Linhas: **284** (+213/-71) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Planilha Dashboard ("rodrigolessa1980/Planilha-Dashboard")

- **[969db84](https://github.com/rodrigolessa1980/Planilha-Dashboard/commit/969db840f5e63c3e5bd3c167903a784438143e07)** - Add deployment section to README with Docker and CI/CD details
  - Linhas: **187** (+187/-0) | Tempo: **1-2 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

---

### quarta-feira, 20/05/2026

**2 commits** | **66 linhas** | **~1.1h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[fc918b6](https://github.com/rodrigolessa1980/controle-de-EPI/commit/fc918b6e22ebb728a9cd1bb54995185b4cbf626e)** - feat: add clipboard copy functionality in Solicitacoes component - Integrated a new utility function to copy the public request URL to the clipboard, enhancing user experience by simplifying link shar...
  - Linhas: **49** (+47/-2) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[69e11b6](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/69e11b61b9fafcc91d5b706ffb047d25ecd08466)** - feat: add CTASmart environment variables for deployment - Included new environment variables for CTASmart integration in the deployment workflow. - Updated the deployment script to handle CTASmart-spe...
  - Linhas: **17** (+16/-1) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

---

### terça-feira, 19/05/2026

**4 commits** | **3873 linhas** | **~13.8h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[15ea2c6](https://github.com/rodrigolessa1980/controle-de-EPI/commit/15ea2c6da4aea39037dc9e0c24ac21653c50f42c)** - feat: improve dialog layout and responsiveness in Solicitacoes component - Updated the DialogContent and form structure to enhance layout and responsiveness, ensuring better user experience on various...
  - Linhas: **18** (+10/-8) | Tempo: **15-30 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[bd821f3](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/bd821f341f37704a18daba2ea4d51b253212f715)** - feat: enhance CTASmart integration with stock synchronization and refuel previews - Added new API endpoints for syncing fuel depot stock from CTASmart and previewing refuels. - Implemented logic to ha...
  - Linhas: **2922** (+2801/-121) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### ExpediÃ§Ã£o ("rodrigolessa1980/expedicao")

- **[247247c](https://github.com/rodrigolessa1980/expedicao/commit/247247c905b89409ad305d3328ff807a73a4cfec)** - feat: add dataAgendamento field to Pedido model and enhance related components for improved order scheduling and tracking
  - Linhas: **134** (+101/-33) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Rastreio de Container ("rodrigolessa1980/rastreio-de-container")

- **[8c78196](https://github.com/rodrigolessa1980/rastreio-de-container/commit/8c78196115df61570f4f2d3e98bb6b613c97f00f)** - Adiciona campo de data de atualiza├º├úo e l├│gica para normalizar IDs de containers, al├®m de atualizar a l├│gica de inser├º├úo e atualiza├º├úo de containers na API.
  - Linhas: **799** (+519/-280) | Tempo: **4-6 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### sexta-feira, 15/05/2026

**3 commits** | **2060 linhas** | **~12.8h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[9e6d266](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/9e6d2662628b3c4eaf0e4eea82ea8582ee1449c2)** - feat: enhance canhotos management with invalidation tracking and UI updates - Added support for tracking invalidated canhotos records, including fields for invalidation reason and record number. - Imp...
  - Linhas: **570** (+533/-37) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[82373fe](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/82373fe0bd9e836568ca542a0c099e5458124802)** - feat: add canhotos export and reconciliation endpoints with fleet ownership filtering - Implemented new API endpoints for exporting canhotos data and retrieving records not in LHG, supporting fleet ow...
  - Linhas: **1442** (+1378/-64) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### ExpediÃ§Ã£o ("rodrigolessa1980/expedicao")

- **[2c3aa6f](https://github.com/rodrigolessa1980/expedicao/commit/2c3aa6fae92a8ed0649d9d719993f657b2f384db)** - feat: add infoFinalizado utility and enhance PedidosTable to display order status with delivery information
  - Linhas: **48** (+42/-6) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quinta-feira, 14/05/2026

** commits** | **290 linhas** | **~3h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[9d44974](https://github.com/rodrigolessa1980/controle-de-EPI/commit/9d44974dcdc1a6831a3e25744cec2d25e4beed08)** - feat: enhance delivery photo handling in FichaEPIModelo and Entregas components - Added functionality to display delivery photos as PDFs in an iframe if the data URL is a PDF, improving user experienc...
  - Linhas: **290** (+190/-100) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### quarta-feira, 13/05/2026

**3 commits** | **3370 linhas** | **~12.4h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[074afde](https://github.com/rodrigolessa1980/controle-de-EPI/commit/074afded090de3726f6cc426e509b690ea224ba3)** - feat: enhance sorting and pagination in various components - Introduced sorting functionality in the Compras, Devolucoes, Entregas, EPIs, Funcionarios, Obras, and Estoque components, allowing users to...
  - Linhas: **2609** (+2308/-301) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[76cef93](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/76cef93f674f0db43a0d6125a2a5131a7c961a6b)** - feat: enhance canhotos reconciliation with NF linkage and clustering - Introduced new fields in SourceRecord for tracking NF references in substitution and cancellation flows. - Implemented logic to b...
  - Linhas: **747** (+702/-45) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Rastreio de Container ("rodrigolessa1980/rastreio-de-container")

- **[b6f49ec](https://github.com/rodrigolessa1980/rastreio-de-container/commit/b6f49ec7018d3184d2c48468b7fda66814c5b4c9)** - Adiciona l├│gica para alterar o layout da aplica├º├úo com base na rota atual, melhorando a responsividade da interface.
  - Linhas: **14** (+12/-2) | Tempo: **15-30 min**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

---

### terça-feira, 12/05/2026

**3 commits** | **4924 linhas** | **~10.8h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[38268cc](https://github.com/rodrigolessa1980/controle-de-EPI/commit/38268cc4eeb5ecb21ea1fb49efa04732f83cec04)** - feat: add obraIds support to user routes and enhance Obras component - Implemented getObraIdsByUser function to retrieve obraIds associated with users, enriching user data in various API responses. - ...
  - Linhas: **42** (+37/-5) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[3636ffa](https://github.com/rodrigolessa1980/controle-de-EPI/commit/3636ffacc2bc61428215b748ff433b6064c8abf8)** - feat: integrate obraIds handling in user and route management - Enhanced user-related routes to support multiple obraIds, improving data context for user access and permissions. - Updated the Usuarios...
  - Linhas: **423** (+384/-39) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[71d0134](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/71d0134f083636346c7709939abe10bf3a238da2)** - feat: enhance reconciliation features with tariff management and spreadsheet integration - Introduced new API endpoints for managing tariffs, including listing, creating, updating, and deleting tariff...
  - Linhas: **4459** (+4453/-6) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### segunda-feira, 11/05/2026

**7 commits** | **3519 linhas** | **~23h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[17a07fc](https://github.com/rodrigolessa1980/controle-de-EPI/commit/17a07fcc2bac7ca5671ad6bc676da0d4c2e78df7)** - feat: enhance permission handling with canInAnyScope function and expand tests - Introduced canInAnyScope function to allow permission checks across all scopes, improving flexibility in user access ma...
  - Linhas: **915** (+754/-161) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[3e1dccb](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/3e1dccb3619082be7b09b5f09afc2c5948aa4ea4)** - feat: enhance trip counting and reconciliation features with new regions and rules - Added support for new counting regions: 'pedreiraCombinada' and 'ultimaSaidaPedreira' in the backend and frontend c...
  - Linhas: **1406** (+1145/-261) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[5f3ea6e](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/5f3ea6e0fbfc18a3236c5ef54c060ff479de398a)** - feat: enhance fleet and operational phase tracking with new calculations and UI improvements - Introduced phase duration calculations for operational phases in the fleet repository, allowing for detai...
  - Linhas: **585** (+506/-79) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[792489f](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/792489f4b413a19d9dcea3ebb13cd888aee4f0f4)** - refactor: improve tooltip content rendering in AvgTimePerPhaseChart component - Updated the tooltip content rendering logic to enhance clarity and usability, ensuring it displays relevant information ...
  - Linhas: **43** (+18/-25) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[f38f477](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/f38f477e3c826d2ec601678c4d3111b8b75b7636)** - feat: enhance freight record management with additional fields and modal display - Added new fields to the FreightRecord and FreightListRow interfaces for improved data tracking, including service cod...
  - Linhas: **177** (+172/-5) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### ExpediÃ§Ã£o ("rodrigolessa1980/expedicao")

- **[e1d0fb4](https://github.com/rodrigolessa1980/expedicao/commit/e1d0fb4fcc5493fb1192f0f9bcc1e44063a25cc5)** - feat: implement interactive orders table with filtering and status management using tanstack-table
  - Linhas: **348** (+216/-132) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[5920c26](https://github.com/rodrigolessa1980/expedicao/commit/5920c2631f0a805ebcf538ebddc6214d2120dfeb)** - feat: implement PedidosTable component with filtering, sorting, and status management using TanStack Table
  - Linhas: **45** (+36/-9) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quarta-feira, 06/05/2026

**8 commits** | **2988 linhas** | **~24.5h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[d4cd938](https://github.com/rodrigolessa1980/controle-de-EPI/commit/d4cd938ac3bfdedce733a359d353a4a539939cf9)** - feat: implement polling endpoint for resource updates and enhance delivery handling - Added a new API endpoint for polling, allowing the frontend to retrieve the latest update timestamps for various r...
  - Linhas: **1205** (+840/-365) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[250b4d9](https://github.com/rodrigolessa1980/controle-de-EPI/commit/250b4d9643de980e08f964ca3341f522ad6e36c8)** - feat: enhance employee and user management with obraIds support - Introduced obraIds as an optional field in user and employee schemas, allowing for multiple obra associations. - Updated employee crea...
  - Linhas: **501** (+357/-144) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### ExpediÃ§Ã£o ("rodrigolessa1980/expedicao")

- **[348fb21](https://github.com/rodrigolessa1980/expedicao/commit/348fb211fa167019670793140bb7aa62be3926f0)** - Add attachment functionality to Pedido model and related components. Introduce PedidoAttachment model in the database schema, enabling file uploads and retrieval for orders. Update API endpoints and f...
  - Linhas: **550** (+543/-7) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[1ca495e](https://github.com/rodrigolessa1980/expedicao/commit/1ca495e54d3abd1a5606c185848cb8e11ee40341)** - Enhance PedidoFormDialog to enforce required fields for representatives in create mode. Add file input handling for attachments, including validation for mandatory fields and improved user feedback on...
  - Linhas: **97** (+86/-11) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[fb865b4](https://github.com/rodrigolessa1980/expedicao/commit/fb865b4ec81286d276320ae83f46fed660902d70)** - Refactor App and related components to integrate calcularCronogramaPedido for improved order tracking. Update KPIs and data handling in useDashboardData and FunilPage to reflect new calculations. Enha...
  - Linhas: **480** (+450/-30) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[28cad96](https://github.com/rodrigolessa1980/expedicao/commit/28cad96491efaa3fd950b3e9ee6cd2b9a2e7b7be)** - Update order creation logic to streamline required fields for representatives. Adjust the payload normalization process to ensure 'dataPedido' is set correctly when missing, enhancing data integrity d...
  - Linhas: **45** (+30/-15) | Tempo: **30-60 min**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

- **[69fb054](https://github.com/rodrigolessa1980/expedicao/commit/69fb05428c8f8ea657e5f9f412463672dcfedded)** - Refactor updateOrder and order creation logic to streamline payload handling. Consolidate field normalization for improved data integrity and adjust required fields for order updates, enhancing overal...
  - Linhas: **79** (+44/-35) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[2dc5326](https://github.com/rodrigolessa1980/expedicao/commit/2dc5326b00c32baef8e47eb355f915c706808c37)** - Refactor order creation validation in PedidoFormDialog to enforce mandatory fields for both representatives and non-representatives. Update payload handling in index.js to ensure proper normalization ...
  - Linhas: **31** (+27/-4) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### terça-feira, 05/05/2026

**4 commits** | **519 linhas** | **~6.3h estimadas**

#### Site QuietArt (marketing) ("RafaelFett/quietart2")

- **[154779b](https://github.com/RafaelFett/quietart2/commit/154779b8c41e4d60c43295687004e81128c3c9b6)** - Refactor specifications section layout to use a grid format with tables for better organization and readability. Updated styles for specs cards and table elements to enhance visual consistency. Adjust...
  - Linhas: **246** (+163/-83) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[a193c29](https://github.com/RafaelFett/quietart2/commit/a193c292cf9f315db9a0989d626f876f72af3204)** - Update section IDs for improved accessibility and navigation. Removed redundant ID from the refugio section and added it to the cta section for better clarity in linking. This enhances the overall str...
  - Linhas: **4** (+2/-2) | Tempo: **5-15 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[d48ace4](https://github.com/RafaelFett/quietart2/commit/d48ace4dd1f0250bae52f84af61044b396ab2f83)** - Update favicon format from SVG to PNG and change the document title to "Quiet Art".
  - Linhas: **5** (+2/-3) | Tempo: **5-15 min**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

#### ExpediÃ§Ã£o ("rodrigolessa1980/expedicao")

- **[1568047](https://github.com/rodrigolessa1980/expedicao/commit/15680478dafdec37cd90662883d39cb77c26a1d9)** - Enhance Pedido model by adding 'dataPedido' field for improved order tracking. Update related database schema and API endpoints to accommodate the new field. Adjust frontend components to support 'dat...
  - Linhas: **264** (+178/-86) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### segunda-feira, 04/05/2026

**3 commits** | **2336 linhas** | **~12.4h estimadas**

#### Site QuietArt (marketing) ("RafaelFett/quietart2")

- **[b73e5e2](https://github.com/RafaelFett/quietart2/commit/b73e5e209021ba4f283e7b808f904200f33b9e27)** - Ajusta layout da se├â┬º├â┬úo de inf├â┬óncia e card de localiza├â┬º├â┬úo. Move a nova se├â┬º├â┬úo para o formato da refer├â┬¬ncia, padroniza o fundo e ajusta propor├â┬º├â┬Áes, ancoragens e espa├â┬ºamen...
  - Linhas: **765** (+519/-246) | Tempo: **4-6 h**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[412e75b](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/412e75bb7a277a6a14964ab80be0de97e9b17623)** - feat: implement user authentication and authorization features - Added user model and role management to support authentication. - Implemented login, logout, and user session management in the fronten...
  - Linhas: **1563** (+1402/-161) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[b438369](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/b4383690052aca349691440fbf658dc252a79bb0)** - refactor: update header styling and layout in App component - Enhanced header styling with improved z-index and backdrop blur for better visibility. - Adjusted layout of dashboard tab strip for full-w...
  - Linhas: **8** (+4/-4) | Tempo: **15-30 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### quinta-feira, 30/04/2026

**5 commits** | **4684 linhas** | **~14.5h estimadas**

#### Site QuietArt (marketing) ("RafaelFett/quietart2")

- **[061ea19](https://github.com/RafaelFett/quietart2/commit/061ea1951b0015a8b112ab12ee0b251051e33b57)** - first commit
  - Linhas: **3973** (+3973/-0) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

#### ExpediÃ§Ã£o ("rodrigolessa1980/expedicao")

- **[2524734](https://github.com/rodrigolessa1980/expedicao/commit/2524734fa30ad6a4a525a7458cde87a1b0d2c764)** - Refactor LoginPage component to improve token handling and user feedback. Removed direct token extraction from URL on initialization, replacing it with a more robust method. Enhanced error and success...
  - Linhas: **227** (+154/-73) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[b36d3ab](https://github.com/rodrigolessa1980/expedicao/commit/b36d3ab37c3f4408f2b2be877775469691dec941)** - Update Pedido model to make 'representante' field optional and adjust related database queries and frontend components accordingly. Enhanced handling of 'representante' in API requests and UI to impro...
  - Linhas: **30** (+18/-12) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[1f423d6](https://github.com/rodrigolessa1980/expedicao/commit/1f423d6e486485b06e4adf954cb2775c50fce884)** - Enhance Pedido and Status models by adding 'updatedAt' field for better tracking of changes. Refactor PedidoFormDialog to filter active representatives, improving user experience in the form submissio...
  - Linhas: **39** (+24/-15) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[5a5b8d0](https://github.com/rodrigolessa1980/expedicao/commit/5a5b8d0124dccacec49c85231c9f5ec0e0dd16f3)** - Add PedidoChangeLog model and enhance Pedido model with createdAt field for better change tracking. Update database schema and related functions to support logging of changes made to Pedido records. I...
  - Linhas: **415** (+356/-59) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quarta-feira, 29/04/2026

**12 commits** | **6984 linhas** | **~19.6h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[aad4e41](https://github.com/rodrigolessa1980/controle-de-EPI/commit/aad4e41be544be4006c3b8798fa62562b6a01cb6)** - feat: enhance delivery and purchase management with new document attachment and stock handling features - Introduced a new schema for attaching delivery documents, including delivery photos and confir...
  - Linhas: **1750** (+1379/-371) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[9db3e9e](https://github.com/rodrigolessa1980/controle-de-EPI/commit/9db3e9ede3b806d1bd64c1703aeda5552c76b9c8)** - feat: enhance Estoque component with new delivery row type and improved data handling - Introduced ObraDeliveryRow type for better structure in delivery data management. - Updated stock and delivery d...
  - Linhas: **33** (+18/-15) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

#### ExpediÃ§Ã£o ("rodrigolessa1980/expedicao")

- **[91baf8f](https://github.com/rodrigolessa1980/expedicao/commit/91baf8f66bfbf5c56adf088a637f51dad1a7a92a)** - Refactor project structure and update configurations. Changed project name from 'sistema-de-exporta-o---joao' to 'expedicao'. Added environment file patterns to .gitignore. Enhanced App component with...
  - Linhas: **4856** (+4427/-429) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[f046501](https://github.com/rodrigolessa1980/expedicao/commit/f046501c717d3b6383d60cb615cfa53a797bf145)** - Enhance CI/CD workflow by normalizing SSH deployment target. Added a step to process and validate server host, user, and port from secrets, ensuring proper SSH connection setup. Updated SSH commands i...
  - Linhas: **66** (+59/-7) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[ee024cc](https://github.com/rodrigolessa1980/expedicao/commit/ee024ccb05f65572c2af4524e9a2c05d2d0cef97)** - Add frontend service to Docker Compose and update CI/CD workflow
  - Linhas: **46** (+44/-2) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[66e4c26](https://github.com/rodrigolessa1980/expedicao/commit/66e4c26362cd55f2d2bb1d160cce303e35bc76d9)** - Update Dockerfile for frontend to use npm install with no audit and no fund options
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[2899b1c](https://github.com/rodrigolessa1980/expedicao/commit/2899b1c9505ecdc640a8bd68187b9fcc483e93e5)** - Refactor Docker Compose configuration to use an environment file for backend service, improving security and maintainability.
  - Linhas: **13** (+2/-11) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[df2ee3a](https://github.com/rodrigolessa1980/expedicao/commit/df2ee3a01f638a7f7cb1581d36a027d30d23c514)** - Refactor authentication logic to streamline user registration and login processes. Updated API endpoints to accept email instead of login, modified error messages for clarity, and adjusted frontend co...
  - Linhas: **50** (+25/-25) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[8e028ed](https://github.com/rodrigolessa1980/expedicao/commit/8e028ed7dee91447490fc6291290e65eb430e3f1)** - Update CI/CD workflow to force-recreate Docker containers and display their status. This change ensures that the backend and frontend services are rebuilt and their current state is visible during dep...
  - Linhas: **4** (+3/-1) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[f41532f](https://github.com/rodrigolessa1980/expedicao/commit/f41532f089421a74fa10c41c4e8e742257265866)** - Update Dockerfile to run the backend with 'node src/index.js' instead of 'npm start' to reduce memory issues in production. Modify start script to disable shell usage for improved process management.
  - Linhas: **5** (+3/-2) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[bd3dca4](https://github.com/rodrigolessa1980/expedicao/commit/bd3dca4df82fd9c0b161e6623326f9210faf06b4)** - Add email confirmation functionality and enhance login page. Implemented a new API endpoint for resending confirmation emails, updated the frontend to handle email confirmation links, and improved use...
  - Linhas: **145** (+134/-11) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[9ed4333](https://github.com/rodrigolessa1980/expedicao/commit/9ed4333e3be0f0dd8016616e87701e0a284e5273)** - Update Dockerfile to include Nginx configuration for frontend and modify CI/CD workflow to track changes in the Nginx configuration file.
  - Linhas: **14** (+14/-0) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

---

### terça-feira, 28/04/2026

**9 commits** | **3192 linhas** | **~15h estimadas**

#### Sala de Reuniao (Monkey-Branch) ("Monkey-Branch/SalaDeReuniao")

- **[994563b](https://github.com/Monkey-Branch/SalaDeReuniao/commit/994563be036781f8a0a415824bd5953664864513)** - Update environment configurations and deployment settings for new port numbers - Changed frontend and backend ports from 5555 and 3764 to 5556 and 3765 respectively in .env.example, Dockerfiles, and d...
  - Linhas: **86** (+43/-43) | Tempo: **1-2 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[92386f0](https://github.com/Monkey-Branch/SalaDeReuniao/commit/92386f0f6e6b3ef088ec023ee26d7476312a2bc1)** - Update deployment configuration to use new image repository paths
  - Linhas: **4** (+2/-2) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[e4155d8](https://github.com/Monkey-Branch/SalaDeReuniao/commit/e4155d8e8f8269fde26f0da9fdb1ca63502ccae8)** - Update boaspraticas.jpg image file
  - Linhas: **0** (+0/-0) | Tempo: **5-15 min**
  - Impacto: Reservas - melhora uso de salas e fluxo administrativo.

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[2f26d8d](https://github.com/rodrigolessa1980/controle-de-EPI/commit/2f26d8d71b8b9d9fdfc1fa905534b2af56cd7439)** - feat: enhance user permission checks for listagem without obra scope - Added new test cases to validate user permissions when listing without a specific obra scope, ensuring that users with scoped per...
  - Linhas: **53** (+38/-15) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[631fe83](https://github.com/rodrigolessa1980/controle-de-EPI/commit/631fe83703c201278d539873005a928fff057596)** - refactor: standardize terminology and structure for item handling across components - Updated various components to replace references to "EPI" with "item" for consistency in terminology. - Refactored...
  - Linhas: **239** (+153/-86) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[e84a630](https://github.com/rodrigolessa1980/controle-de-EPI/commit/e84a6302ad684c79e994c7501ee2a44fa251216f)** - fix: improve geolocation handling and user feedback in PublicDeliverySignature component - Added a null state reset for geoSource to ensure proper handling of geolocation requests. - Updated loading m...
  - Linhas: **33** (+25/-8) | Tempo: **30-60 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[c5bb6c8](https://github.com/rodrigolessa1980/controle-de-EPI/commit/c5bb6c8241a7289dcf184e520f59579c4f91c04f)** - feat: enhance employee management with improved CPF handling and restoration logic - Added functionality to check for existing employees by normalized CPF and obraId, allowing for restoration of previ...
  - Linhas: **115** (+87/-28) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[da8457c](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/da8457ca5412b15cf23f7a4b9d80871acb205eb4)** - feat: integrate CTASmart refuels synchronization and enhance reconciliation features - Added new models and API endpoints for CTASmart refuels, including fetching and summarizing refuel data. - Implem...
  - Linhas: **2660** (+2627/-33) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[cbaaccd](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/cbaaccd2604f7c1638df109123859ab709117a29)** - fix: add ComplementInterval type import to reconciliationRepository - Imported the `ComplementInterval` type from the complementRecalcService to enhance type safety in the reconciliation repository. -...
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

---

### segunda-feira, 27/04/2026

**3 commits** | **569 linhas** | **~6.1h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[f606655](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/f6066556f8487141a55d91064ad2ca1510d9bd0a)** - refactor: simplify ComplementsPage layout and improve overflow handling - Removed unnecessary PageScrollArea component, replacing it with a section for better semantic structure. - Adjusted overflow h...
  - Linhas: **14** (+7/-7) | Tempo: **15-30 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[9268cff](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/9268cff49f4ef21a96643975b7eb286af22ec751)** - refactor: improve layout and overflow handling in App, ReconciliationPage, and TripsPage - Removed unnecessary PageScrollArea components, replacing them with semantic sections for better structure. - ...
  - Linhas: **48** (+24/-24) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[2f8e170](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/2f8e1709289b3719fcbbc9ac847adcd24cbaddb1)** - documenta├º├úo API abastecimento
  - Linhas: **507** (+507/-0) | Tempo: **4-6 h**
  - Impacto: Documentacao - facilita onboarding e operacao.

---

### sexta-feira, 24/04/2026

**6 commits** | **1014 linhas** | **~10.1h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[9cdc460](https://github.com/rodrigolessa1980/controle-de-EPI/commit/9cdc460f3f79210dd0e906207da222af8422d529)** - refactor: update EPI model to remove tenantId and simplify unique constraints - Removed tenantId field from the EPI model, allowing for a global catalog of EPIs shared across tenants. - Adjusted uniqu...
  - Linhas: **157** (+150/-7) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[65204c5](https://github.com/rodrigolessa1980/controle-de-EPI/commit/65204c58d38b4cb90f91334707ce3ebf1deabd39)** - refactor: simplify CA registry handling by removing tenantId dependency - Removed tenantId field from the CaRegistry model, allowing for a global catalog of CA records shared across tenants. - Updated...
  - Linhas: **81** (+42/-39) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[881c36e](https://github.com/rodrigolessa1980/controle-de-EPI/commit/881c36e67d95e6ae7815ac0b13944f090be3681c)** - feat: implement Excel import functionality for employee management - Added a new endpoint for importing employee data from Excel files, allowing bulk creation of employees and associated obras. - Impl...
  - Linhas: **464** (+457/-7) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[8cfc344](https://github.com/rodrigolessa1980/controle-de-EPI/commit/8cfc3444c1b75d074247e363d7afa05f1c763beb)** - refactor: replace fragment shorthand with explicit Fragment component in Funcionarios - Updated the Funcionarios component to use the Fragment component explicitly instead of shorthand syntax for bett...
  - Linhas: **12** (+5/-7) | Tempo: **15-30 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[b9426c7](https://github.com/rodrigolessa1980/controle-de-EPI/commit/b9426c7b00401ef92abf1ba00bb3051553a5565d)** - feat: add cidade field to Excel import and obra creation logic - Updated the Excel import functionality to include a new optional 'cidade' field in the ExcelImportRow type, allowing for the import of ...
  - Linhas: **265** (+217/-48) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[4a5cc4e](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/4a5cc4ee15b42193b3b84dc3cb14adb3a0618041)** - feat: enhance ComplementsPage with collapsible add form and improved UI elements - Added a collapsible button to toggle the visibility of the add complement form, improving user interaction. - Introdu...
  - Linhas: **35** (+25/-10) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quinta-feira, 23/04/2026

**4 commits** | **935 linhas** | **~8.7h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[abb42e9](https://github.com/rodrigolessa1980/controle-de-EPI/commit/abb42e97ed32023a6a199cbb44930fba35acb5b9)** - feat: add purchaseBatchId to Purchase model and enhance related functionalities - Introduced purchaseBatchId field in the Purchase model to group related purchases. - Updated purchase creation schema ...
  - Linhas: **379** (+244/-135) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[2206b6b](https://github.com/rodrigolessa1980/controle-de-EPI/commit/2206b6b3e177e578e99d40058d656c9a8e316f08)** - feat: implement scoped permissions for user access control - Introduced ScopedPermission type to manage permissions with obraId context, enhancing access control granularity. - Updated UserPermission ...
  - Linhas: **524** (+423/-101) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[e39e357](https://github.com/rodrigolessa1980/controle-de-EPI/commit/e39e35777bebf8f01e6693df5c32b392f8175a12)** - refactor: simplify EPI route handling by removing tenantId dependency - Removed tenantId checks from EPI-related routes to streamline access and improve code clarity. - Updated error messages for dupl...
  - Linhas: **23** (+8/-15) | Tempo: **15-30 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[14f420b](https://github.com/rodrigolessa1980/controle-de-EPI/commit/14f420bb9a69e896e734bfeaba9d509195d77d6e)** - chore: remove vercel.json configuration file - Deleted the vercel.json file as it is no longer needed for deployment configuration.
  - Linhas: **9** (+0/-9) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

---

### quarta-feira, 22/04/2026

**5 commits** | **4555 linhas** | **~27h estimadas**

#### Site QuietArt (marketing) ("RafaelFett/quiteartspa")

- **[a65d5c6](https://github.com/RafaelFett/quiteartspa/commit/a65d5c6744721a86d97b585afc2c85ac00359c16)** - Primeiro commit do site QuietArt Made-with: Cursor
  - Linhas: **2004** (+2004/-0) | Tempo: **6-8 h+**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[5ef36dc](https://github.com/rodrigolessa1980/controle-de-EPI/commit/5ef36dc3850ee4cb936baa6bfce078ffce6d5ec7)** - feat: enhance delivery signature process with IP capture and required fields - Added termsAccepted and deliveryPhoto fields to the delivery signature payload, ensuring compliance with new requirements...
  - Linhas: **299** (+266/-33) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[84e515c](https://github.com/rodrigolessa1980/controle-de-EPI/commit/84e515ca795f16665dc44fbf4674e03e43eacb21)** - feat: enhance stock management with audit logging and adjustment tracking - Introduced StockAdjustmentLog model to track stock adjustments, including details such as previous and new quantities, opera...
  - Linhas: **599** (+557/-42) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[bab8bea](https://github.com/rodrigolessa1980/controle-de-EPI/commit/bab8beafddd8f8f2fb792e9ebf5a724716d3edea)** - fix: update favicon and enhance Navbar and Sidebar components - Changed favicon from SVG to PNG format for improved compatibility. - Simplified Navbar component by removing unnecessary tenant title di...
  - Linhas: **1094** (+796/-298) | Tempo: **6-8 h+**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[3563a9e](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/3563a9e39031ca0bcc5da696ca8bfdec51fb51c8)** - Enhance Excel data handling in NovoPedidoModal and excelExtractor. Added lote management features, including extraction and validation rules. Updated state management for lote-specific handling in the...
  - Linhas: **559** (+536/-23) | Tempo: **4-6 h**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

---

### terça-feira, 21/04/2026

** commits** | **215 linhas** | **~3h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[b500dff](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/b500dff09a299a5b5432bb637091e2647a74a658)** - feat: enhance fleet and reconciliation features with new regions and statuses - Added support for new regions: 'Pedreira Min├®rio 2' and 'P├ítio - Fazenda' in various components and repositories. - Up...
  - Linhas: **215** (+155/-60) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### segunda-feira, 20/04/2026

**4 commits** | **2471 linhas** | **~13.6h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[1c5e0ba](https://github.com/rodrigolessa1980/controle-de-EPI/commit/1c5e0ba9f4874089d5392a2d58d89ab4dfd37755)** - feat: enhance CA import functionality and user experience - Added support for importing CA data from .xlsx and .csv files, including validation and preview features. - Implemented progress tracking fo...
  - Linhas: **1370** (+1230/-140) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[14e1420](https://github.com/rodrigolessa1980/controle-de-EPI/commit/14e1420d8441aa3da2907c49469111e17417c00f)** - feat: enhance EPI request handling with optional fields and improved validation - Updated EPIRequest model to include optional itemName and size fields, allowing for more flexible item requests. - Mod...
  - Linhas: **949** (+636/-313) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[712abac](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/712abac0867204a039996abc62d63d7ab1b229f8)** - feat: add crValorAReceber field and enhance reconciliation details - Introduced the `crValorAReceber` field in the `FreightRecord` model to track receivable amounts. - Updated the reconciliation repos...
  - Linhas: **148** (+127/-21) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[ca6698c](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/ca6698ce8ab94418a8a92df9bdb384302bdd175a)** - fix: update FreightPage to display crValorAReceber instead of servicoValor - Replaced instances of `servicoValor` with `crValorAReceber` in the FreightPage component to reflect the correct receivable ...
  - Linhas: **4** (+2/-2) | Tempo: **5-15 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

---

### domingo, 19/04/2026

**4 commits** | **2611 linhas** | **~15.2h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[8eb9f0b](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/8eb9f0b98745a9bcab9738e308c902cb373efb50)** - feat: add missing NFs retrieval and enhance canhotos record schema - Introduced `cancelledNfRef` and `substituteNfRef` fields in the `CanhotosRecord` model to track additional NF references. - Impleme...
  - Linhas: **450** (+429/-21) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[b37eedd](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/b37eedd533ed8b766d66124df2789725a744deed)** - feat: add NFe divergence report functionality and enhance reconciliation details - Introduced a new API endpoint to generate NFe divergence reports, comparing LHG and canhotos data based on date range...
  - Linhas: **584** (+528/-56) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[c7716f9](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/c7716f902f26fba2a7e8fd0f7c618b51b5ae9c4e)** - refactor: change LhgImportModal export to default and update import in ReconciliationPage - Updated the export of `LhgImportModal` to default export for consistency. - Modified the import statement in...
  - Linhas: **4** (+2/-2) | Tempo: **5-15 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[85e0676](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/85e06769d884ece7481a0e7534b132c1c2c09d57)** - feat: add NFe official comparison functionality and enhance reconciliation report - Implemented a new function to build official NFe comparisons, allowing for detailed analysis of LHG and canhoto reco...
  - Linhas: **1573** (+1452/-121) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### quinta-feira, 16/04/2026

**4 commits** | **23425 linhas** | **~7.8h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[b827198](https://github.com/rodrigolessa1980/controle-de-EPI/commit/b827198ef87757b54ee4a552c5c4ec291aa5db33)** - feat: enhance EPI management with new models and permissions - Introduced CaRegistry model for managing national CA catalog with idempotency checks. - Extended Delivery and Purchase models to include ...
  - Linhas: **23402** (+21821/-1581) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[31f23ff](https://github.com/rodrigolessa1980/controle-de-EPI/commit/31f23ffa7378a06ca61bfbdd530b6f4b995f8819)** - feat: update Dockerfile to include new scripts and backend routes - Added scripts directory to the Docker image for frontend build processes. - Included backend routes file to ensure proper routing fu...
  - Linhas: **2** (+2/-0) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[d178201](https://github.com/rodrigolessa1980/controle-de-EPI/commit/d17820165d5bdef88f8278be53596e54cff13ae1)** - fix: update .dockerignore to refine backend context inclusion - Excluded the entire backend directory from the Docker context, while allowing the schema contract for schema synchronization checks. - S...
  - Linhas: **6** (+5/-1) | Tempo: **15-30 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[0abe112](https://github.com/rodrigolessa1980/controle-de-EPI/commit/0abe112e2386ccc3511dc4eec110021840aef2e4)** - feat: increase file upload limits and support additional file types - Updated body and file size limits for uploads to 200MB in backend configuration. - Enhanced file type validation to accept .csv an...
  - Linhas: **15** (+10/-5) | Tempo: **15-30 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quarta-feira, 15/04/2026

**5 commits** | **1688 linhas** | **~12.6h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[f0e658c](https://github.com/rodrigolessa1980/controle-de-EPI/commit/f0e658c815963010df8a632f179095a02a28d881)** - feat: enhance user experience with CPF handling and access scope display - Added CpfInput component for better CPF input handling and formatting. - Implemented CPF validation logic in the backend and ...
  - Linhas: **1078** (+866/-212) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[31dd863](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/31dd86304b5848f70d7cd02f6ea28fd0282bd970)** - feat: enhance LHG import processing and UI to support additional fields - Added optional fields for driver name, process number, fleet code, and canhoto copy in the import processing logic and data mo...
  - Linhas: **160** (+141/-19) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[f7f8fee](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/f7f8feeb1a8c8386a6dfd788d0e8d4231aca9fb5)** - refactor: streamline import processing and improve validation logic - Simplified the revival of invalid rows in the import process by removing unnecessary checks and consolidating logic. - Updated the...
  - Linhas: **73** (+18/-55) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[5476778](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/5476778e9806bf8fc63755732abca96661500eb8)** - feat: enhance reconciliation summary and UI to include canhoto copy details - Updated the `getReconciliationSummary` function to include the `canhotoCopy` field in the SQL query, improving data retrie...
  - Linhas: **24** (+21/-3) | Tempo: **15-30 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[5c81aed](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/5c81aed31a6433a3fa419aa6f9f811d689037341)** - feat: add fleet number support and enhance fleet marker management - Introduced `fleetNumber` field in the Vehicle model to track fleet associations. - Implemented new API endpoints for retrieving and...
  - Linhas: **353** (+309/-44) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### segunda-feira, 13/04/2026

**3 commits** | **4039 linhas** | **~17h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[16d3ce9](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/16d3ce9a765b06ab480339fbd828c9afaa61c180)** - feat: enhance mobile responsiveness and UI components for better user experience - Updated the mobile responsiveness checklist with a detailed progress log for implementation. - Refactored various com...
  - Linhas: **924** (+751/-173) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[94f0593](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/94f059324ea22c8ee14e70308b7a8e56f2fe86de)** - feat: enhance freight data management and reconciliation processes - Introduced new `CanhotosRecord` and `FreightRecord` models in the Prisma schema to support additional freight data. - Updated the `...
  - Linhas: **2612** (+2252/-360) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[840df26](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/840df2672ea4a6890c90f66d0da54ea785feea74)** - feat: enhance API configuration and freight synchronization logic - Updated `.env.example` and `vite.config.ts` to improve API base URL handling and proxy configuration for local development. - Introd...
  - Linhas: **503** (+346/-157) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### domingo, 12/04/2026

**4 commits** | **2080 linhas** | **~16h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[b4c9535](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/b4c9535237a33a8c1d99a4091200efe974862347)** - feat: enhance fleet and reconciliation data handling with trip history and caching - Added support for including trip history in fleet data queries, allowing for more comprehensive data retrieval. - U...
  - Linhas: **876** (+761/-115) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[e1e6123](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/e1e61236bdb0fe6871b769cc08b5fdf6f629dc69)** - feat: update LHG unique key and enhance import processing with batch recalibration
  - Linhas: **320** (+213/-107) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[4e29e31](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/4e29e315c792b20b3393269ff80b927e1ecade23)** - feat: refactor LHG unique key and enhance reconciliation details retrieval - Updated the unique key for LHG records to use only recordNumber, improving data integrity and import idempotency. - Added a...
  - Linhas: **642** (+577/-65) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[16e6a11](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/16e6a119985bc5fa0a89eff56547a485b17f931b)** - feat: update LHG record schema and import processing to support optional rate and gross value - Modified the LHG records schema to allow `rate_per_ton` and `gross_value` fields to be nullable, enhanci...
  - Linhas: **242** (+208/-34) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### sábado, 11/04/2026

**3 commits** | **1726 linhas** | **~8.6h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[6e8ae9e](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/6e8ae9ec850b2e35488649ab5c3d58a24b6f03a9)** - feat: introduce truck complements management and enhance fleet data handling - Added TruckComplement model to the Prisma schema for managing truck-trailer relationships. - Implemented API endpoints fo...
  - Linhas: **1555** (+1454/-101) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[dc7a3ce](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/dc7a3ce3fe58264401afa007eddbc078e3aa272f)** - feat: enhance fleet and reconciliation data handling with query state management - Introduced FleetQueryState and ReconciliationQueryState interfaces to manage query parameters for fleet and reconcili...
  - Linhas: **169** (+160/-9) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[6f63a88](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/6f63a88190a61af6e25e9bd22ffe09775fa55392)** - fix: update Dockerfile to include Prisma directory for build context - Added COPY command for the prisma directory in both builder and production stages to ensure Prisma schema is available during the...
  - Linhas: **2** (+2/-0) | Tempo: **5-15 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

---

### sexta-feira, 10/04/2026

**3 commits** | **6209 linhas** | **~17h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[3d2196a](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/3d2196adbe38d2bb83e35414b3d579e856737df9)** - Enhance fleet management by adding logic to query the latest region event per vehicle, improving status determination. Refactor TripsTable component for better trip row handling and expand functionali...
  - Linhas: **333** (+234/-99) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[6e9368c](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/6e9368cadc00473cb56904f1f04890e8178c81e4)** - Batch LHG import, progress bar, auto-close, and LHG trip history display - importsService: replace N├ù2 sequential upserts with 1 findMany + chunked createMany + $transaction for updates ÔÇö eliminate...
  - Linhas: **1805** (+1637/-168) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[0591356](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/059135633c474ddd68fb89674e37db99526eaf10)** - feat: add LHG import modal and reconciliation data handling - Implemented LhgImportModal component for importing LHG and Canhotos spreadsheets. - Added useReconciliationData hook to fetch reconciliati...
  - Linhas: **4071** (+3176/-895) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quinta-feira, 09/04/2026

**12 commits** | **10830 linhas** | **~37.2h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[36bdb81](https://github.com/rodrigolessa1980/controle-de-EPI/commit/36bdb818d4567f1ba39ec847c00fc862674e6991)** - Enhance EPI and Purchase models, and improve form handling in frontend components - Added `productCode` field to the EPI model and updated unique constraints for better data integrity. - Introduced `m...
  - Linhas: **3385** (+2738/-647) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[c6ab3b8](https://github.com/rodrigolessa1980/controle-de-EPI/commit/c6ab3b800a8f2682eaf1f320341ade897ea29ddd)** - feat: add ARCHIVED status to requests and implement archiving functionality - Updated EPIRequest model to include ARCHIVED status. - Implemented archiveRequest and archiveRequestBatch actions in the s...
  - Linhas: **3512** (+3072/-440) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[1c58387](https://github.com/rodrigolessa1980/controle-de-EPI/commit/1c5838794657ab55fa318acd04000358b2bddf47)** - feat: add validityUntil field to Purchase model and update related components
  - Linhas: **430** (+329/-101) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[477c2af](https://github.com/rodrigolessa1980/controle-de-EPI/commit/477c2af72babcab2f7cb5fb732d9db53cdc86a2e)** - refactor: remove responsibleUserId from Obra model and related components - Updated the Obra model to eliminate the responsibleUserId field, simplifying the relationship with users. - Adjusted related...
  - Linhas: **107** (+38/-69) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[4873347](https://github.com/rodrigolessa1980/controle-de-EPI/commit/487334780f9097e16e7e950a0420e18dfb2dbc06)** - feat: implement EPI return and discard functionality with inspection links - Added print functionality for individual employee EPI records and reports for all employees. - Introduced new interfaces fo...
  - Linhas: **2346** (+1980/-366) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[eba350e](https://github.com/rodrigolessa1980/controle-de-EPI/commit/eba350ef2164434d24091eb2dddfe2981bfbcdec)** - feat: add validity handling for EPI products and enhance related components
  - Linhas: **605** (+513/-92) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[9c78258](https://github.com/rodrigolessa1980/controle-de-EPI/commit/9c7825868f28c84d3ea452122ae13bc875222cdf)** - feat: enhance EPI and Purchase models with validity handling and XML import checks
  - Linhas: **236** (+82/-154) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[1cdbac9](https://github.com/rodrigolessa1980/controle-de-EPI/commit/1cdbac95d27e6d9e974cf4d9e4684e5f841f185a)** - feat: add tenantId handling to PublicEPIRequest and Solicitacoes components
  - Linhas: **39** (+35/-4) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[564a45c](https://github.com/rodrigolessa1980/controle-de-EPI/commit/564a45c9b07289d2d751228916ec85b65d0b0bb1)** - feat: disable buttons in Solicitacoes component based on tenantId availability - Added conditional disabling for the "Pedir EPI - Link P├║blico" and "Copiar link p├║blico" buttons. - Updated button ti...
  - Linhas: **7** (+7/-0) | Tempo: **15-30 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[fbd8750](https://github.com/rodrigolessa1980/controle-de-EPI/commit/fbd8750aafe1d91fcdd596739428b9156ae06b0e)** - feat: improve CA validity handling in Compras component - Integrated getEPIEffectiveCaValidUntil function to streamline CA validity checks for EPI items. - Updated purchaseRowCaValidity and related re...
  - Linhas: **88** (+58/-30) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[898abf2](https://github.com/rodrigolessa1980/controle-de-EPI/commit/898abf2d4858a60515bce6c0a83b7adccf4fa771)** - feat: add tenantName handling across user-related components - Updated user retrieval in routes to include tenantName for enhanced user context. - Modified Navbar and Sidebar components to display ten...
  - Linhas: **57** (+44/-13) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[fd048a4](https://github.com/rodrigolessa1980/controle-de-EPI/commit/fd048a45b5001cbb8a0f6846e939134d2fa616d9)** - feat: lazy load DashboardLayout and update Navbar export - Implemented lazy loading for the DashboardLayout component to improve performance. - Wrapped DashboardLayout in a Suspense component to handl...
  - Linhas: **18** (+13/-5) | Tempo: **15-30 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quarta-feira, 08/04/2026

**3 commits** | **2316 linhas** | **~10.8h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[e35e9e1](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/e35e9e104023922904342c9c4a96b42c32fe973d)** - Enhance fleet management features by integrating timezone support and trip counting options. Update API and data fetching logic to accommodate new parameters for timezone, region, and event type. Refa...
  - Linhas: **2087** (+1367/-720) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[a93659e](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/a93659e79566912e2a14baa7056eb19f6cf4a7c2)** - Add support for 'Fila' region in fleet management and update related queries - Extend TruckDto and related types to include 'Fila' as a valid region. - Modify database queries to handle 'Fila' region ...
  - Linhas: **201** (+174/-27) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[d68fe63](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/d68fe6340015ad12652a1985dfb1c571f6e09eff)** - Add UTC timezone support across the application and update related components
  - Linhas: **28** (+16/-12) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### terça-feira, 07/04/2026

**3 commits** | **614 linhas** | **~5.9h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[4e534b2](https://github.com/rodrigolessa1980/controle-de-EPI/commit/4e534b2f6a9b6b5b811b8a9ac44cb63a5902cc55)** - Implement date handling utilities and enhance form validation in Compras and EPIs components - Added utility functions for date formatting and parsing in Compras and EPIs components to improve date in...
  - Linhas: **568** (+367/-201) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[74e1e26](https://github.com/rodrigolessa1980/controle-de-EPI/commit/74e1e26eed6ef38a13e02785adfeaf304bfb60bb)** - Enhance form validation and user feedback in Compras component - Added visual indicators for required fields and validation errors in the Compras form. - Updated labels to indicate mandatory fields wi...
  - Linhas: **44** (+36/-8) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[a858918](https://github.com/rodrigolessa1980/controle-de-EPI/commit/a858918074e338dd40f91b6030023d0043b7b7e3)** - Fix validation message formatting in Compras component - Updated the quantity validation error message to use a proper greater-than symbol for clarity. - Ensured consistency in user feedback for requi...
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

---

### quinta-feira, 02/04/2026

**4 commits** | **920 linhas** | **~6.4h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[71a692e](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/71a692ed27248fa5c27aa55589982b520260351a)** - Update environment configuration and enhance synchronization logic. Change API base URL to localhost:3475, adjust sync interval settings, and improve database schema for hourly sync tracking. Refactor...
  - Linhas: **857** (+653/-204) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[7640c91](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/7640c912fa241a5261060bb13bc1681fa5b01816)** - Enhance VPS deployment workflow by adding remote directory creation and improving SSH command execution. Update comments for clarity on server path requirements.
  - Linhas: **13** (+12/-1) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[80e0908](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/80e090880be991dd0b303a0998b22f4af5a54f25)** - Refactor VPS deployment workflow to improve Git synchronization and streamline remote script execution. Added support for dynamic repository and branch handling, enhancing deployment flexibility.
  - Linhas: **40** (+25/-15) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[de18371](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/de183716cbf86b04daf437a69e23acb953eb15d2)** - Refine VPS deployment workflow by adding logic to clear existing files in the destination directory before cloning the repository. Update comments for better clarity on deployment process and server r...
  - Linhas: **10** (+8/-2) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

---

### quarta-feira, 01/04/2026

**2 commits** | **3001 linhas** | **~7.4h estimadas**

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[1ba6022](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/1ba60225aefa7eb0af27471077ef45250c1551b4)** - Add showTimeRange prop to RoomColumn and update time display - Introduced showTimeRange prop to conditionally display start and end times of meetings. - Adjusted font sizes for better readability. - E...
  - Linhas: **23** (+16/-7) | Tempo: **15-30 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[2811075](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/281107596ec72aa12ec2f4c6666ac4e9181e17ed)** - Implement enhanced synchronization features for Autotrac, including new endpoints for sync jobs and progress tracking. Update database schema to support vehicle and information region management, and ...
  - Linhas: **2978** (+2525/-453) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### segunda-feira, 30/03/2026

**10 commits** | **2846 linhas** | **~24.4h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[c259830](https://github.com/rodrigolessa1980/controle-de-EPI/commit/c2598305a79e04977ca64b7a16319831b98e0ac1)** - Refactor tenant selection in Login component by removing automatic tenant ID selection and adding a default disabled option in the dropdown. This improves user experience by prompting users to select ...
  - Linhas: **9** (+6/-3) | Tempo: **15-30 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[7d39e24](https://github.com/rodrigolessa1980/controle-de-EPI/commit/7d39e24b3ff618df168255b9fb56a727a56726b5)** - Refactor store initialization in use-store.ts by removing mock data and introducing default empty states for users, obras, employees, and purchases. This change enhances data integrity by ensuring no ...
  - Linhas: **71** (+44/-27) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[d3fd26a](https://github.com/rodrigolessa1980/controle-de-EPI/commit/d3fd26a0ff7660a309bb5968d2b769483a727b9a)** - Enhance EPI management in Compras component by implementing CA normalization and automatic EPI linking. Introduce modal for creating new EPIs during XML import, improving user experience and data inte...
  - Linhas: **171** (+131/-40) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[a592aa2](https://github.com/rodrigolessa1980/controle-de-EPI/commit/a592aa2cf980075fc7cf2b89f3ade1d96c4ed4d5)** - Enhance usePaginatedBackendList hook by adding isLoadedOnce state to prevent unnecessary loading on subsequent fetches. Update Compras component to integrate react-hook-form for EPI creation, improvin...
  - Linhas: **555** (+442/-113) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[dd8669d](https://github.com/rodrigolessa1980/controle-de-EPI/commit/dd8669d79c209feb693513bf8115262233547c42)** - Refactor data handling in multiple components to implement optimistic UI updates. Introduce useMemo for filtering optimistic data in Compras, Devolucoes, Entregas, EPIs, Estoque, Funcionarios, Obras, ...
  - Linhas: **233** (+148/-85) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[5441cba](https://github.com/rodrigolessa1980/controle-de-EPI/commit/5441cba570c651cb2047b0a7707bfb1c51e3afb7)** - Update refreshBackend calls in use-store.ts to use true for all data operations, ensuring immediate UI updates after backend interactions.
  - Linhas: **22** (+11/-11) | Tempo: **15-30 min**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

- **[cc8617e](https://github.com/rodrigolessa1980/controle-de-EPI/commit/cc8617e501e58371f540de615bf8a220b9eb43b6)** - Add employee removal functionality in Funcionarios component - Introduced a delete button for removing employees, which prompts for confirmation before executing the action. - Updated the store to han...
  - Linhas: **51** (+49/-2) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[ed6ef1d](https://github.com/rodrigolessa1980/controle-de-EPI/commit/ed6ef1de6b904a251d47724f6a1d6e5d113597a6)** - Enhance employee management by implementing soft delete functionality - Added a `deletedAt` field to the Employee model to support soft deletion. - Updated backend routes to filter out deleted employe...
  - Linhas: **32** (+23/-9) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[c28ce32](https://github.com/rodrigolessa1980/controle-de-EPI/commit/c28ce32e401ae53243156e7e8b205c6ac30eb7cf)** - Implement user activation status and enhance related functionalities - Added `isActive` field to the User model to manage user activation status. - Updated user-related routes to check for active stat...
  - Linhas: **572** (+432/-140) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[bcb563f](https://github.com/rodrigolessa1980/controle-de-EPI/commit/bcb563fc3b49ef2e7cbb6798bd528d37a4d7c55e)** - Enhance route handling and permissions in backend and frontend components - Introduced foreign key constraint error handling in user and EPI deletion routes to improve error responses. - Updated the C...
  - Linhas: **1130** (+955/-175) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### sexta-feira, 27/03/2026

** commits** | **201 linhas** | **~3h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[0600233](https://github.com/rodrigolessa1980/controle-de-EPI/commit/0600233fb73d697b9f01b03b1dd2cae60e098bab)** - Implement server-sent events (SSE) for tenant change notifications in backend routes. Introduce event handling for client connections and disconnections, and update frontend store to manage tenant eve...
  - Linhas: **201** (+167/-34) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### quinta-feira, 26/03/2026

**3 commits** | **914 linhas** | **~9h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[42c3060](https://github.com/rodrigolessa1980/controle-de-EPI/commit/42c306057da493384bda76cd93ccddfe9ec110be)** - Enhance data synchronization in App and Dashboard components by introducing a new interval for refreshing backend data. Update polling logic to ensure UI reflects real-time data without requiring a pa...
  - Linhas: **356** (+79/-277) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[061a560](https://github.com/rodrigolessa1980/controle-de-EPI/commit/061a5607b958e9760f8a88b9783d2e86ef627521)** - Refactor authentication and backend handling in App and Login components. Remove mock backend logic and improve error messaging for backend availability. Update form handling in Login for better user ...
  - Linhas: **275** (+156/-119) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[d6a99d7](https://github.com/rodrigolessa1980/controle-de-EPI/commit/d6a99d7ab308d7eb36e746b3ce2ca6811891cf00)** - test
  - Linhas: **283** (+43/-240) | Tempo: **2-4 h**
  - Impacto: Qualidade - aumenta confianca em regressoes e releases.

---

### quarta-feira, 25/03/2026

**24 commits** | **7117 linhas** | **~40.6h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[e0ae63e](https://github.com/rodrigolessa1980/controle-de-EPI/commit/e0ae63e4dd45ec96e7c564cbcc3ad6813d4f8da2)** - Refactor backend routes to enhance query handling with new optional parameters for responsible users and scope IDs. Update date filtering logic to improve date parsing and range handling. Implement pa...
  - Linhas: **900** (+729/-171) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[c56d18e](https://github.com/rodrigolessa1980/controle-de-EPI/commit/c56d18eb6337f54e4c254c04b3f69120d39d3466)** - Refactor backend routes to utilize a purchase delegate for improved data handling in purchase-related API endpoints. Enhance error handling for unavailable purchase module and streamline stock managem...
  - Linhas: **69** (+62/-7) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[64b1e72](https://github.com/rodrigolessa1980/controle-de-EPI/commit/64b1e72e5b3512a13d7ad145668585d00fc55022)** - deploy TEST
  - Linhas: **451** (+419/-32) | Tempo: **2-4 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[121a101](https://github.com/rodrigolessa1980/controle-de-EPI/commit/121a101d2c3e626880a9793eb471f2eb63fd058f)** - asd
  - Linhas: **1847** (+1779/-68) | Tempo: **6-8 h+**
  - Impacto: Operacional - impacto em controle de EPIs e conformidade interna.

- **[dd20201](https://github.com/rodrigolessa1980/controle-de-EPI/commit/dd202012b6a1caf1719f336c3e6e9532ff578cdc)** - Enhance deployment workflow by adding SSH key preparation and fallback password method for improved reliability. Implement failure handling to ensure deployment success is verified, providing better f...
  - Linhas: **40** (+38/-2) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[9f5367f](https://github.com/rodrigolessa1980/controle-de-EPI/commit/9f5367ffc850ee6818f5725353b70fd10bc473cc)** - Update backend deployment workflow to utilize environment variable for DEPLOY_PASSWORD, enhancing security and consistency in failure handling during SSH deployment fallback.
  - Linhas: **6** (+4/-2) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[f45134a](https://github.com/rodrigolessa1980/controle-de-EPI/commit/f45134ad8ab49e023f150f84f48adaf41068b294)** - Refactor SSH key preparation in backend deployment workflow to enhance security and reliability. Implement logic to handle both PEM and raw base64 formats for the SSH key, ensuring proper formatting b...
  - Linhas: **24** (+23/-1) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[b61f9b7](https://github.com/rodrigolessa1980/controle-de-EPI/commit/b61f9b7846cdb2a29ed07671ee0c6280112728a5)** - Update backend Docker workflow to use secrets for registry and image name, enhancing security and configuration management.
  - Linhas: **4** (+2/-2) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[b530cba](https://github.com/rodrigolessa1980/controle-de-EPI/commit/b530cba835e38b6d1615a9fa01ec9de1f83814c4)** - Refactor backend Docker workflow to normalize image references, improving consistency and reliability in image handling during deployment.
  - Linhas: **42** (+36/-6) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[6fa8c55](https://github.com/rodrigolessa1980/controle-de-EPI/commit/6fa8c55ef75d1bf338b4ac9d2d2dcd778943089f)** - sd
  - Linhas: **1** (+1/-0) | Tempo: **5-15 min**
  - Impacto: Operacional - impacto em controle de EPIs e conformidade interna.

- **[f91d9ea](https://github.com/rodrigolessa1980/controle-de-EPI/commit/f91d9ea2e11f48cf92b417d41db854f56cd9f323)** - 213
  - Linhas: **1** (+1/-0) | Tempo: **5-15 min**
  - Impacto: Operacional - impacto em controle de EPIs e conformidade interna.

- **[b274d31](https://github.com/rodrigolessa1980/controle-de-EPI/commit/b274d31407a007a92e4baf780b27334171f52993)** - asd
  - Linhas: **26** (+14/-12) | Tempo: **30-60 min**
  - Impacto: Operacional - impacto em controle de EPIs e conformidade interna.

- **[57ff977](https://github.com/rodrigolessa1980/controle-de-EPI/commit/57ff977938e22065984ca002e11d16c757da5406)** - Enhance backend deployment workflow by implementing tenant-based logic for user management and environment configuration. Update Docker deployment scripts to support tenant-specific settings, ensuring...
  - Linhas: **736** (+582/-154) | Tempo: **4-6 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[f245b99](https://github.com/rodrigolessa1980/controle-de-EPI/commit/f245b99095a795aa7c977bd3836455911a70cf61)** - Remove legacy container to prevent naming conflicts in backend Docker workflow, ensuring smoother deployment process.
  - Linhas: **6** (+6/-0) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[2d07343](https://github.com/rodrigolessa1980/controle-de-EPI/commit/2d07343b661d82955a5aa055b4fd46cf3093b19a)** - Add support for deployment configuration by including docker-compose.deploy.yml in backend Docker workflow
  - Linhas: **6** (+6/-0) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[6d70412](https://github.com/rodrigolessa1980/controle-de-EPI/commit/6d70412d5301bca73c33f464c29ec05debcd7bd5)** - Update docker-compose.deploy.yml to add backend service configuration and remove MySQL service. Adjust backend Docker workflow to reflect changes in deployment setup.
  - Linhas: **15** (+10/-5) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[ecb1838](https://github.com/rodrigolessa1980/controle-de-EPI/commit/ecb1838e5c592e700b0c7540cc1b94aad7c7a659)** - Update backend deployment configuration to clarify MySQL host requirements in .env files and enhance error handling in Docker workflow for production environments.
  - Linhas: **21** (+20/-1) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[64dce16](https://github.com/rodrigolessa1980/controle-de-EPI/commit/64dce168bea9a5b3c8b8f87854af76260f2e691d)** - Enhance backend Docker workflow by adding additional environment variables for deployment configuration, improving the handling of secrets in .env files, and clarifying MySQL host requirements in erro...
  - Linhas: **80** (+70/-10) | Tempo: **1-2 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[981f33d](https://github.com/rodrigolessa1980/controle-de-EPI/commit/981f33d2c7e4ce810da75d89643597e1c7f76f58)** - Update deployment configuration to include frontend service in docker-compose, enhance .env.example documentation for backend URL usage, and adjust TypeScript configuration for better project structur...
  - Linhas: **112** (+101/-11) | Tempo: **1-2 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[2de30ef](https://github.com/rodrigolessa1980/controle-de-EPI/commit/2de30ef78c652f032d89a306f4f66ac223bcded5)** - Enhance backend and frontend functionality by adding tenant management scripts, updating seed logic for tenant creation, and modifying password reset flow to include tenant ID. Update package.json fil...
  - Linhas: **396** (+376/-20) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[7c20409](https://github.com/rodrigolessa1980/controle-de-EPI/commit/7c20409996ce6aa6c33d5847498425262d5f4a9e)** - Refactor API calls in Login, PublicDeliverySignature, and PublicEPIRequest components to use fetchWithTimeout for improved error handling. Update LoadingScreen to include accessibility attributes. Int...
  - Linhas: **170** (+139/-31) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[2ad1855](https://github.com/rodrigolessa1980/controle-de-EPI/commit/2ad1855dc230d4f57945a83775d4c32729085f1c)** - Update package dependencies in package.json and package-lock.json to lower versions for @vitest/coverage-v8 and vitest, and add new dependencies for @ampproject/remapping, @isaacs/cliui, and @istanbul...
  - Linhas: **2152** (+966/-1186) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[90f6536](https://github.com/rodrigolessa1980/controle-de-EPI/commit/90f65369ecaa373edc513d97324b07d0a927aeb0)** - Refactor environment variable schema in env.ts to improve NODE_ENV handling by introducing a preprocessing step that defaults to 'development' and allows for 'prod' to be recognized as 'production'.
  - Linhas: **9** (+8/-1) | Tempo: **15-30 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[1aebb1d](https://github.com/rodrigolessa1980/controle-de-EPI/commit/1aebb1d79bf8c1a287a7381bad2c50bf47bad48c)** - Update Dockerfile to copy node_modules from the build stage instead of deps, ensuring compatibility with Prisma generation and client installation.
  - Linhas: **3** (+2/-1) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

---

### terça-feira, 24/03/2026

**6 commits** | **4631 linhas** | **~30h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[59594d7](https://github.com/rodrigolessa1980/controle-de-EPI/commit/59594d7cc42b4d8055f8e71324632756fe0d36b0)** - Implement purchase management features including schema updates, CRUD operations, and UI enhancements. Add Purchase model to Prisma schema, create purchase handling routes, and integrate purchase data...
  - Linhas: **1468** (+975/-493) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[b371304](https://github.com/rodrigolessa1980/controle-de-EPI/commit/b3713041cab5e95c1a57b3cdb8ce518d746d340e)** - Refactor Sidebar component to enhance navigation structure by grouping items into sections with associated colors. Remove FlowLegend from multiple pages to streamline UI. Update Solicitacoes component...
  - Linhas: **483** (+292/-191) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[bfeac47](https://github.com/rodrigolessa1980/controle-de-EPI/commit/bfeac4766911e4cf30d919b726015d71b6d9395b)** - Enhance delivery handling by updating schemas and routes to support batch requests and optional fields. Refactor frontend components to accommodate new data structures, including consolidated item dis...
  - Linhas: **533** (+390/-143) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[d921ea1](https://github.com/rodrigolessa1980/controle-de-EPI/commit/d921ea15a399d5e2978a2069b35058ecbcb18fbb)** - Refactor stock management and delivery components to support batch processing and improve user experience. Update schemas to include new fields and enhance error handling. Implement signature preview ...
  - Linhas: **828** (+655/-173) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[5d31670](https://github.com/rodrigolessa1980/controle-de-EPI/commit/5d31670176de7a6591742188a400626b9d610356)** - Enhance data filtering and pagination across multiple components by introducing search bars, date range filters, and pagination controls. Update backend schemas to support new query parameters and imp...
  - Linhas: **1091** (+997/-94) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[a2837fd](https://github.com/rodrigolessa1980/controle-de-EPI/commit/a2837fde10cf59d2ad59bf696ab99b85a7d310ad)** - Update Prisma schema to change photo field type for ReturnDisposal model. Enhance Fastify app configuration by increasing body limit to 10MB. Refactor delivery routes to include confirmed signature an...
  - Linhas: **228** (+172/-56) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### segunda-feira, 23/03/2026

**6 commits** | **3614 linhas** | **~21.5h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[f561de7](https://github.com/rodrigolessa1980/controle-de-EPI/commit/f561de71b05159b3fc8d457a58056d60fbe98574)** - Refactor loading state in App component; extract LoadingScreen component for better code organization. Remove unnecessary refreshBackend interval and ensure backend initialization occurs only once.
  - Linhas: **31** (+16/-15) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[29cb3f8](https://github.com/rodrigolessa1980/controle-de-EPI/commit/29cb3f8ad9307ae5899176b8d2d4e4f9897ebabe)** - Update Obra model to allow nullable responsibleUserId; adjust related schemas and forms for optional responsible user handling. Enhance UI to indicate when no responsible user is assigned.
  - Linhas: **59** (+40/-19) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[c11f6b8](https://github.com/rodrigolessa1980/controle-de-EPI/commit/c11f6b814aafe73826b4f863197c7baac5f3a5ea)** - Update EPI schema to require a minimum of 2 characters for CA field; modify manual documentation for improved clarity and structure. Enhance Manual component with scroll functionality and active headi...
  - Linhas: **557** (+271/-286) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[2a2f0c0](https://github.com/rodrigolessa1980/controle-de-EPI/commit/2a2f0c056e1d587d176a5f9529e2c9996b65ad38)** - Enhance request logging and error handling in backend; add hooks for request start and end logging, and improve error responses with detailed logging. Update frontend forms to enforce validation and p...
  - Linhas: **542** (+476/-66) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[7e73d9c](https://github.com/rodrigolessa1980/controle-de-EPI/commit/7e73d9c2c7b283a942999ef988b84123dbc9825d)** - Enhance backend request handling by adding support for batch EPI requests and public delivery signature links; update Prisma schema to include new models and fields. Refactor frontend forms to accommo...
  - Linhas: **2176** (+1948/-228) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[441ddf2](https://github.com/rodrigolessa1980/controle-de-EPI/commit/441ddf2a22bd3bc833ba9b8422ce32a3656990ca)** - Refactor Compras component to group purchase requests by batch ID, enhancing data organization and display. Introduce employee name retrieval and update table structure to show grouped items and total...
  - Linhas: **249** (+168/-81) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### sexta-feira, 20/03/2026

** commits** | **872 linhas** | **~5h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[2c2ad2d](https://github.com/rodrigolessa1980/controle-de-EPI/commit/2c2ad2d460690cbc19982467129dea635f95aea6)** - Add quantity field to Employee model; implement batch employee creation and update forms. Enhance dashboard calculations to account for employee quantities. Update mock data and adjust user interface ...
  - Linhas: **872** (+799/-73) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quinta-feira, 19/03/2026

**9 commits** | **11487 linhas** | **~42.8h estimadas**

#### Controle de EPI ("rodrigolessa1980/controle-de-EPI")

- **[c7e7af8](https://github.com/rodrigolessa1980/controle-de-EPI/commit/c7e7af8302b1d23f382e9b6d4ef10d827beb8b83)** - Update
  - Linhas: **347** (+314/-33) | Tempo: **2-4 h**
  - Impacto: Operacional - impacto em controle de EPIs e conformidade interna.

- **[431b280](https://github.com/rodrigolessa1980/controle-de-EPI/commit/431b2801942ab3353d4f1bdc331b4dd6db605f6f)** - base backend
  - Linhas: **2799** (+2799/-0) | Tempo: **6-8 h+**
  - Impacto: Operacional - impacto em controle de EPIs e conformidade interna.

- **[84a0cc8](https://github.com/rodrigolessa1980/controle-de-EPI/commit/84a0cc8b6b1176dc57d6a8ef09f537d9423d5f16)** - Add testing framework and initial test cases; update dependencies
  - Linhas: **4272** (+4223/-49) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[854f736](https://github.com/rodrigolessa1980/controle-de-EPI/commit/854f7366414ecbda0f5c0161abb35936f1baef26)** - Update package dependencies, switch testing environment to jsdom, and enhance code coverage metrics. Add tests for permission checks and store functionalities.
  - Linhas: **1437** (+1257/-180) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[29da390](https://github.com/rodrigolessa1980/controle-de-EPI/commit/29da390bf6f62264cbb49d4759f67a4d5b7d6a4c)** - Update code coverage metrics to 100% across various services and mock files; add tests for handling missing product blocks in NFe XML parsing.
  - Linhas: **253** (+179/-74) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[de244c5](https://github.com/rodrigolessa1980/controle-de-EPI/commit/de244c56cd0af80d5b85553a887f2b746559450a)** - Update database name to 'controle_epi_main' in configuration files and Docker setup; upgrade dotenv package to version 17.3.1.
  - Linhas: **35** (+27/-8) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[8babd19](https://github.com/rodrigolessa1980/controle-de-EPI/commit/8babd196146437bf0e19c38146c7b248964b94e9)** - Enhance backend health check and frontend integration; display backend status in Navbar and DashboardLayout. Implement periodic backend refresh in App component.
  - Linhas: **417** (+356/-61) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[17eebef](https://github.com/rodrigolessa1980/controle-de-EPI/commit/17eebef715f56a3a6dcaa4c3711e04381b7dcca2)** - Implement user authentication with JWT; add email and password fields to user model and forms. Enhance manual and documentation for backend integration and CRUD operations.
  - Linhas: **1328** (+1257/-71) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[6eaae2c](https://github.com/rodrigolessa1980/controle-de-EPI/commit/6eaae2c1d93fd2f4392aa0ca9c5712a4daee87ad)** - login
  - Linhas: **599** (+538/-61) | Tempo: **4-6 h**
  - Impacto: Operacional - impacto em controle de EPIs e conformidade interna.

---

### sexta-feira, 13/03/2026

** commits** | **1296 linhas** | **~7h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[aa27bbc](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/aa27bbc84a905769a4460cf5c80be6249b1548f4)** - Enhance Autotrac synchronization features by adding endpoints for authorized units, information regions, and region events. Update fuel depot and distributions endpoints to fetch data from the databas...
  - Linhas: **1296** (+1230/-66) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quinta-feira, 12/03/2026

**3 commits** | **10057 linhas** | **~14.4h estimadas**

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[c0de626](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/c0de626c10c9cf96c558457e8592b60f89e6710c)** - uhuhuhuh
  - Linhas: **11** (+1/-10) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[c4a9f7c](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/c4a9f7c0139e9252362d80008d5c59ae9282e8a3)** - Update .gitignore to include environment files, enhance App component to handle mock data state, and refactor data fetching in useFleetData and useFuelDepotData hooks for improved error handling and s...
  - Linhas: **8445** (+8030/-415) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[09bc8be](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/09bc8be757e201887f301506635257b0da21a4fe)** - Merge branch 'main' of https://github.com/rodrigolessa1980/dashboard-Transporte
  - Linhas: **1601** (+717/-884) | Tempo: **6-8 h+**
  - Impacto: Gestao de frota - melhora visibilidade de KPIs e decisao logistica.

---

### quarta-feira, 11/03/2026

**5 commits** | **1061 linhas** | **~8.8h estimadas**

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[276bd7e](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/276bd7ea1142419c93e53badebcfa963a9b0e5d4)** - countdown
  - Linhas: **624** (+624/-0) | Tempo: **4-6 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[66795c8](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/66795c8c3bc70957ca87317902405b9d88a0730f)** - countdown
  - Linhas: **7** (+4/-3) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[cb9317c](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/cb9317ced98eceed8e7f532454d791b0936106bf)** - Update CountdownPage styling for improved responsiveness - Changed minHeight to height for full viewport height. - Adjusted width to 100vw for better layout consistency. - Updated width property to us...
  - Linhas: **5** (+3/-2) | Tempo: **5-15 min**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

- **[5715b3f](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/5715b3fd13ce377af0ca8ee6f5f6ac819cce5bce)** - asd
  - Linhas: **8** (+7/-1) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[62b2911](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/62b291163be0f8d4a96585570353b286de8b038a)** - sad
  - Linhas: **417** (+414/-3) | Tempo: **2-4 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### segunda-feira, 09/03/2026

** commits** | **2811 linhas** | **~7h estimadas**

#### Dashboard de Transporte / Frota ("rodrigolessa1980/dashboard-Transporte")

- **[411c65d](https://github.com/rodrigolessa1980/dashboard-Transporte/commit/411c65d3eef969eadd5f03a51dd6f7483746f4e4)** - BASE
  - Linhas: **2811** (+2786/-25) | Tempo: **6-8 h+**
  - Impacto: Gestao de frota - melhora visibilidade de KPIs e decisao logistica.

---

### quarta-feira, 04/03/2026

**3 commits** | **132 linhas** | **~2.4h estimadas**

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[8347764](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/8347764fe6b92ff7fed9c7210e4c9b5c44d31e24)** - Admins can schedule meetings for others and have no time or user limit
  - Linhas: **92** (+81/-11) | Tempo: **1-2 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[f75883d](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/f75883d72e83b65601916a9f522de08093374a6d)** - Search
  - Linhas: **38** (+34/-4) | Tempo: **30-60 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[59be4db](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/59be4db48f8d7a2d7a73373cd798d77a06ef20b8)** - Refactor JWT token generation in auth route to remove expiration setting - Simplified token generation by removing the expiration option, defaulting to the standard behavior. - Ensured consistency in ...
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### terça-feira, 03/03/2026

**2 commits** | **320 linhas** | **~3.8h estimadas**

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[5465b6e](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/5465b6efe91c6816a2cca1dc430e2859987b2f44)** - Refactor MeetingsCalendar to improve room color management and enhance DayDisplayStaticPage - Introduced a new `getRoomColor` function to dynamically assign colors to rooms based on their codes. - Rep...
  - Linhas: **264** (+148/-116) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[9b16b48](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/9b16b481442906a1ba9ab43ce56af767fd2ddde8)** - Enhance MeetingsCalendar color management with past date handling - Updated ROOM_COLOR_PALETTE to include a new color scheme for active meetings. - Introduced `muteColorForPast` function to apply mute...
  - Linhas: **56** (+43/-13) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### terça-feira, 24/02/2026

**2 commits** | **1100 linhas** | **~7.4h estimadas**

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[680e539](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/680e539e7c136291eb3768bd05b1d7bd8125532e)** - Implement reservation deletion restrictions for non-admin users in MeetingsCalendar - Added validation to prevent non-admin users from deleting past meetings. - Introduced feedback alerts to inform us...
  - Linhas: **17** (+16/-1) | Tempo: **15-30 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[aa9c403](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/aa9c403603d894c9985b940403910ddfa4e182df)** - Update index.html, enhance routing, and add display API functionality - Replaced JavaScript asset in index.html for improved performance. - Added new display routes in app.js to support display-relate...
  - Linhas: **1083** (+725/-358) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### segunda-feira, 23/02/2026

** commits** | **265 linhas** | **~3h estimadas**

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[6ab05c2](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/6ab05c2ba28b9f1a4f8cb909e081b63b313430f0)** - Update index.html, replace assets, and enhance routing and styling in various components - Added favicon link to index.html for improved branding. - Updated JavaScript and CSS assets for better perfor...
  - Linhas: **265** (+192/-73) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### sexta-feira, 20/02/2026

**23 commits** | **3948 linhas** | **~37.1h estimadas**

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[0d958de](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/0d958def69d9931592d78c4b694d5fff6c806a4d)** - Enhance email sending functionality with error handling and increase mailer connection timeouts
  - Linhas: **71** (+55/-16) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[b7a3da0](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/b7a3da075ccf098e446e7d1ef4dd60cddd4ee227)** - Deploy again, SMTP
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[d01b94d](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/d01b94d5995efa65e0c3e5b53fdc54ad936e03f6)** - smtp n8n
  - Linhas: **60** (+57/-3) | Tempo: **30-60 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[ee4ef33](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/ee4ef33629d036f6c5a91a4aa70a4c2098bc61e0)** - Refactor user filtering logic in AdminPage to allow filtering by either name or email, defaulting to show all users when no filters are applied.
  - Linhas: **21** (+12/-9) | Tempo: **15-30 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[beb9614](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/beb9614a5e59e58db58fe0b8ffbe921b63885c3b)** - Refactor AdminPage to improve user filtering UI by updating placeholder text and removing unnecessary validation messages. Clean up Dashboard by removing settings modal and related state management.
  - Linhas: **26** (+3/-23) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[1f9eb00](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/1f9eb00147a8a2850f9e500264f22ef25ce9cfd5)** - Delete
  - Linhas: **554** (+518/-36) | Tempo: **4-6 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[9893cb3](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/9893cb3fe9d98d79dd2d72a79b4061e56a325325)** - Refactor MeetingsCalendar and ScheduleForm components to enhance reservation preview functionality and improve action handling. Added feedback states for actions and integrated date handling in reserv...
  - Linhas: **171** (+114/-57) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[d04bce2](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/d04bce2fd001a23e4e564bd23600d60f63605392)** - Add user profile retrieval endpoint and enhance session management - Implemented a new GET endpoint '/me' in the auth route to fetch the current user's profile information. - Updated the API service t...
  - Linhas: **241** (+187/-54) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[219bf2c](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/219bf2c5036fd5cd7855c1479fdb735acaa6d7c1)** - Enhance MeetingTooltip and RoomColumn components for improved reservation details display - Updated MeetingTooltip to include clearer labels for room owner and reservation times. - Added conditional r...
  - Linhas: **72** (+48/-24) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[d8c4fd6](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/d8c4fd65efda9261db7aaee4ef19437edaa6ed27)** - Add maintenance reservation functionality and update related components - Introduced a new reservation type for maintenance in the database schema and updated the API to handle this type. - Enhanced t...
  - Linhas: **322** (+283/-39) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[09d2f79](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/09d2f7950496bab353e9cff84dfb9995b3058e00)** - Update database configuration and refactor reservation handling in routes - Added 'dateStrings' option to MySQL connection pool for better date handling. - Refactored date handling in reservations rou...
  - Linhas: **160** (+90/-70) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[41b84f1](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/41b84f165e186480b01894208208edc78ed22c29)** - Enhance MeetingsCalendar and DayDisplayPage components for improved reservation management - Exported ReservationSlice type for better accessibility across components. - Implemented lane assignment lo...
  - Linhas: **404** (+311/-93) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[107a634](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/107a634557b74c927a6c3867140244fb877657c4)** - Refactor MeetingsCalendar and DayDisplayPage components to streamline room visibility management - Exported ROOM_COLORS for consistent room color usage across components. - Removed groupByRoom state a...
  - Linhas: **145** (+70/-75) | Tempo: **1-2 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[fe634e3](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/fe634e360d72325d0d83acd390b10c90632916b4)** - Add reservation flags handling to reservations API and MeetingsCalendar component - Implemented retrieval of reservation flags in the reservations API, associating flags with their respective reservat...
  - Linhas: **72** (+70/-2) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[ecde48d](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/ecde48d4e75557b3d8de35a1c0400476918a3a84)** - Enhance ScheduleForm to support time input detection and improve user experience - Added support for detecting browser compatibility with time input fields. - Updated start and end time fields to cond...
  - Linhas: **32** (+28/-4) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[6c8a8c6](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/6c8a8c68669a83b360b31b829fb0f0d4aaec4e64)** - teste
  - Linhas: **41** (+39/-2) | Tempo: **30-60 min**
  - Impacto: Qualidade - aumenta confianca em regressoes e releases.

- **[4ca4f61](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/4ca4f6143c72a5ead4078df16a163738d1fae5b3)** - Refactor ScheduleForm to improve time input handling and validation - Updated time fields to separate hour and minute inputs for better user experience. - Implemented validation for hour and minute in...
  - Linhas: **300** (+240/-60) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[6b6f3e3](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/6b6f3e3ff30d219088fc8d87519b086a475ce5b1)** - Add restore functionality for reservation deletion logs in AdminPage - Implemented a new endpoint to restore deleted reservations based on logs. - Enhanced AdminPage to include a restore button for ea...
  - Linhas: **159** (+154/-5) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[fda1166](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/fda11664fa82d7e1645c1744567de2e84f2e0c6c)** - Enhance DayAgendaCalendar and DayDisplayPage for dark background support - Added a new `darkBackground` prop to the DayAgendaCalendar component to allow for a soft dark background option. - Updated ba...
  - Linhas: **39** (+27/-12) | Tempo: **30-60 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[ea56a38](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/ea56a383768fefeef7dada534f6206dc9be098fb)** - Update assets and enhance DayDisplayPage with burn-in protection - Replaced JavaScript and CSS assets with updated versions for improved performance. - Removed unused image asset to streamline the pro...
  - Linhas: **939** (+585/-354) | Tempo: **4-6 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[9b513da](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/9b513da5369c439563afeca2fad8fe1f0600ea6f)** - Enhance ScheduleForm layout and styling for improved user experience - Added a Clock icon to indicate meeting time input. - Updated layout to use flexbox for better alignment and spacing of time field...
  - Linhas: **83** (+51/-32) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[8cd5451](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/8cd5451e33fa927464e9b312cf6c63e9b2a482c8)** - Remove footer hora legend from RoomFilterEmptyState in MeetingsCalendar component to streamline UI
  - Linhas: **8** (+0/-8) | Tempo: **15-30 min**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[9dcf2f2](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/9dcf2f249b5fba60628d6bc983c7b8ae0c1053aa)** - Add favicon link to index.html and enhance LoginPage layout with footer - Added a favicon link in the head of index.html for improved branding. - Updated LoginPage layout to include a footer with logo...
  - Linhas: **26** (+20/-6) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quinta-feira, 19/02/2026

**21 commits** | **8212 linhas** | **~36h estimadas**

#### Agenda Sala de Reuniao (rodrigolessa1980) ("rodrigolessa1980/agenda-sala-reuni-o")

- **[d7a6f39](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/d7a6f39187bcee6f98dbe2e4a458ab3120839e70)** - base backend
  - Linhas: **5307** (+4797/-510) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[6ee3984](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/6ee39842511d3f48f6cc45c47617912c84f414e2)** - mock remove
  - Linhas: **281** (+192/-89) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[1cada35](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/1cada35d94973e0bfab8329875d72c622046ff59)** - Add user role and activation update endpoint; enhance reservation handling and room management
  - Linhas: **960** (+832/-128) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[e1567ed](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/e1567edee86bc9fb2bc04c14e661c10cd65bc484)** - a
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[7cca7b0](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/7cca7b0f8afbb46139f046ebf43c2a904f103263)** - a
  - Linhas: **13** (+7/-6) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[4ed19c1](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/4ed19c1cf34324d52e218fb1b2aa927ba8d1203e)** - asdasd
  - Linhas: **112** (+43/-69) | Tempo: **1-2 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[2b50ca4](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/2b50ca40fa70594a64ea9537f257c262c19efd63)** - asdasd
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[5c3ab7e](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/5c3ab7e4b70f4e1646efde096377936fe81e8429)** - Add deleteRoom and updateUser methods to AppState interface; ensure type safety with parameter types
  - Linhas: **349** (+347/-2) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[c2348ff](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/c2348ff945836ad71cd1219bbcd45f2f7e1c3740)** - DEPLOY
  - Linhas: **96** (+95/-1) | Tempo: **1-2 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[164cfc2](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/164cfc2e36413be016284cde3f986cf0442a93e7)** - DEPLOY AGORA VAI
  - Linhas: **8** (+4/-4) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[3d17872](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/3d17872ba4cc6662106992cfd22d830089daffd3)** - Secrets
  - Linhas: **22** (+11/-11) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[3cc2fc4](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/3cc2fc4cf5972c3d7f6f250f4b333d6498a2b54e)** - A
  - Linhas: **6** (+3/-3) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[546da00](https://github.com/rodrigolessa1980/agenda-sala-reuni-o/commit/546da000510a59d61798ef48b9d85ec2768285c0)** - 56
  - Linhas: **74** (+23/-51) | Tempo: **30-60 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[d465646](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/d465646c45e3c4cf6f10f6aa812358ef11d9f6ea)** - V1.3 - prod BL
  - Linhas: **301** (+259/-42) | Tempo: **2-4 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[ae4511b](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/ae4511b4fa2c99bd8d9e52b8e7da564c3b6d037d)** - V1.3 - Refactor PipelineBoard, PipelineGroupRow, and PipelineRow components to use dynamic grid layout. Removed fixed width properties and replaced them with responsive gridTemplateColumns for improve...
  - Linhas: **145** (+32/-113) | Tempo: **1-2 h**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[5e7e113](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/5e7e1133cf4a4f12ea40d625f8fc5b7ed3be8ea0)** - V1.4 - Alterar Senha
  - Linhas: **207** (+206/-1) | Tempo: **2-4 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[276eea9](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/276eea95daa4c04342fbf9d05097c82a34dece76)** - V1.4 - Login
  - Linhas: **4** (+2/-2) | Tempo: **5-15 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[749b77b](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/749b77b41fd5f3e884d3e04ff7b029f2ffc8bfc1)** - Acesso rapido removido
  - Linhas: **89** (+1/-88) | Tempo: **1-2 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[63f54a0](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/63f54a042c4b1bc9bf2c7d81a4fd6852622fb4f6)** - logo
  - Linhas: **8** (+5/-3) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[eea72c4](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/eea72c40019e27682f6c9ac3f2c1711669fc8e4c)** - V1.5 - Build
  - Linhas: **141** (+89/-52) | Tempo: **1-2 h**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

- **[cd753b2](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/cd753b27d4d06bbe5cdce4e5e7d6ea96372c7c73)** - V1.5 - Config
  - Linhas: **85** (+53/-32) | Tempo: **1-2 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### sábado, 14/02/2026

** commits** | **951 linhas** | **~5h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[8c7da7c](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/8c7da7c61947dc03a0b6be87b3785e559a897a5e)** - V1.3 - Optimize dashboard and Kanban flow with performance enhancements. Added detailed optimization checklist and metrics logging for backend queries. Improved SSE handling with deduplication and rec...
  - Linhas: **951** (+825/-126) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quinta-feira, 12/02/2026

**2 commits** | **124 linhas** | **~1.6h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[89fca0a](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/89fca0a8cbc209cfc8f4860a4c9eb082a5d58013)** - V1.3
  - Linhas: **120** (+104/-16) | Tempo: **1-2 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[44f1b9f](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/44f1b9fed9b00487b78445d398cc920a8b4b5791)** - V 1.3 - fix rejection
  - Linhas: **4** (+3/-1) | Tempo: **5-15 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

---

### quarta-feira, 11/02/2026

** commits** | **683 linhas** | **~5h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[7b01e1f](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/7b01e1f4f3711afb56bbc5a2c95d27be54b19ace)** - V1.3 - Diretoria 2 vistos
  - Linhas: **683** (+665/-18) | Tempo: **4-6 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### terça-feira, 10/02/2026

**3 commits** | **563 linhas** | **~6.4h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[95e1fc9](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/95e1fc9416614f1673512adb6cdea70bcad337c8)** - V1.3 - Update Regra de neg├│cio
  - Linhas: **214** (+164/-50) | Tempo: **2-4 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[66502b1](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/66502b1781782da2122388d4a1dfdd6ef564063b)** - V1.3 - Implement multi-role support for users, enhancing user management capabilities. Updated database schema to include user_roles table, modified user creation and update processes to handle multip...
  - Linhas: **337** (+269/-68) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[e4b5575](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/e4b5575e3ae09f150227130dd9dba1706b61cf6f)** - V1.3 - Add multi-profile support explanation to Regras de Negocio, clarifying user permissions based on assigned profiles. Updated summary for editing and advancing orders to reflect new multi-profile...
  - Linhas: **12** (+11/-1) | Tempo: **15-30 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### segunda-feira, 09/02/2026

**6 commits** | **6103 linhas** | **~34h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[b46d63e](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/b46d63e132223a290ed32a8bb11ec7fff44e0ac3)** - V1.2 - Null user to advance on the Production
  - Linhas: **1321** (+957/-364) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[1add3a1](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/1add3a1050f6fe84e0e2b3f346052837c918e946)** - V1.2 - Enhance PedidosConcluidos component with sorting functionality and improved data handling for estoque, including new order criteria and display formatting for validade.
  - Linhas: **532** (+302/-230) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[3087ab5](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/3087ab572ddeea2d4f89188a352ac3107355bfb5)** - relatorio
  - Linhas: **1532** (+1174/-358) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[88a4e8c](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/88a4e8c7428da6b625554b2d7af98853db2c6219)** - V1.2 - Enhance relatorio functionality by updating the pedidos por produto query to include additional metrics such as total embarcado, total baixas, saldo estoque, and percentual atendimento. Introdu...
  - Linhas: **324** (+276/-48) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[3f80930](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/3f809308a21f504182d4a872bbca6e2c3fbfd01b)** - V1.2 - Refactor RelatorioModal and Dashboard to integrate RelatorioTab. Removed unused state and imports from RelatorioModal, enhancing code clarity. Updated Dashboard to manage active tab state for r...
  - Linhas: **1556** (+864/-692) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[4524d16](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/4524d16977f32096efaf50075bef30d5514aab98)** - V1.3 - CRUD User
  - Linhas: **838** (+757/-81) | Tempo: **4-6 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### sexta-feira, 06/02/2026

** commits** | **306 linhas** | **~3h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[b0565e9](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/b0565e97d9d905d82466d2af0ea5c087ee0d0f73)** - V1.2 - Implement product duplication check in order creation, enhancing user feedback for pending items in the active orders list. Update TODO with detailed requirements for product search and notific...
  - Linhas: **306** (+283/-23) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### quarta-feira, 04/02/2026

**3 commits** | **164 linhas** | **~2.6h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[b94c237](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/b94c237551da123f8c059708ce57dca8460b8999)** - V1.2 - Implement SSE notifications for document and pedido updates, enhancing real-time data synchronization across the application.
  - Linhas: **94** (+84/-10) | Tempo: **1-2 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[99a7054](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/99a70546709e69e0324ed585b3c944e0cbf97c0b)** - V1.2 - Deploy new name for less conflict
  - Linhas: **55** (+27/-28) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

#### Rastreio de Container ("rodrigolessa1980/rastreio-de-container")

- **[8533509](https://github.com/rodrigolessa1980/rastreio-de-container/commit/85335098a8ef5ffb7ba5d99b0a5e559d67d9d364)** - pm2 container name
  - Linhas: **15** (+9/-6) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### terça-feira, 03/02/2026

**2 commits** | **1599 linhas** | **~8.5h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[80c3c69](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/80c3c69b1eba0bd3e2be2a8b2345c9f5b4a4f8c1)** - V1 - Excell better image resolution and data format, keep alive , avoid disconect
  - Linhas: **1452** (+1269/-183) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[7ed442d](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/7ed442d0f0d25181f5c5a01ed76e82ec77f40fb3)** - V1.2 - Disconection and reconection fix
  - Linhas: **147** (+142/-5) | Tempo: **1-2 h**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

---

### segunda-feira, 02/02/2026

**10 commits** | **1937 linhas** | **~17.2h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[93818a4](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/93818a4f9c0d2bcf9f6e2ac943dbbe5a79afa5ab)** - V1.1 - feat: Add PDF to image conversion functionality in upload and compression services, enhancing file handling capabilities for image and PDF uploads.
  - Linhas: **470** (+431/-39) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[d9fbfc2](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/d9fbfc27f739792a47557baa79c36af1ee1187a3)** - V1- feat: Update document handling to support Excel file extraction internally, replacing the obsolete webhook. Added new endpoint for Excel extraction and updated modals for file validation and proce...
  - Linhas: **723** (+608/-115) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[31da204](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/31da204339f0611b6afa854a544847a5f00960cc)** - V1.2 - feat: Enhance deployment process with automatic PM2 startup after server reboot using cron, and add health check endpoint for monitoring server status.
  - Linhas: **129** (+109/-20) | Tempo: **1-2 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[c6002e2](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/c6002e2520e1ac5ffcfd2157ec09f38fa0e91ddb)** - V1.2 - Deploy
  - Linhas: **18** (+18/-0) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[5161c92](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/5161c92a19e1ec018a39cf192bb1b62ce0bc981e)** - V1.2 - Node version update
  - Linhas: **10** (+6/-4) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[7451ee0](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/7451ee079de4c33be97ee9c332b69dbb9ce2548b)** - V1.2 - ERR_REQUIRE_ESM
  - Linhas: **19** (+15/-4) | Tempo: **15-30 min**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

- **[db562a8](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/db562a8d56e2154d729727ca0353060846451dfa)** - V1 - Validade
  - Linhas: **229** (+209/-20) | Tempo: **2-4 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[2ff674e](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/2ff674e3f11f48dd131a42ac8d7c2642500b6328)** - V1.2 - Excell packinglist and invoice, group docs
  - Linhas: **306** (+298/-8) | Tempo: **2-4 h**
  - Impacto: Documentacao - facilita onboarding e operacao.

- **[6040cc9](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/6040cc9fd9f09d6dd72931616802e79dbc485026)** - V1 - deploy fix
  - Linhas: **17** (+17/-0) | Tempo: **15-30 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[5246ec9](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/5246ec9ef1dd702cad12d3d891f79c73d9614df5)** - V11.2 - old deploy
  - Linhas: **16** (+1/-15) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

---

### sábado, 31/01/2026

** commits** | **210 linhas** | **~3h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[7547f95](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/7547f956a9eeac6ddf9a2b1034249cca0d35328d)** - V1 - SSE
  - Linhas: **210** (+133/-77) | Tempo: **2-4 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### sexta-feira, 30/01/2026

**3 commits** | **3514 linhas** | **~17h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[07100cb](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/07100cb38044ee88aac1ac6c9a5afe67f47fc959)** - V1 - feat: Implement Kanban-based order management system including dashboard, status-specific views, authentication, and product data formatting utility, and loading screen, grouping on docs and step...
  - Linhas: **1323** (+748/-575) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[cebc993](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/cebc9931eef71b1c2e58dec261c6eae361b81af9)** - V1.1 - feat: Introduce Kanban board for order management with new modals, AI validation, and stock tracking capabilities.
  - Linhas: **1905** (+1149/-756) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[c1826fb](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/c1826fb9a3816c47eefa90263c11e269a772e0ba)** - V1 - Readme and n8n updates
  - Linhas: **286** (+108/-178) | Tempo: **2-4 h**
  - Impacto: Documentacao - facilita onboarding e operacao.

---

### quinta-feira, 29/01/2026

**4 commits** | **2408 linhas** | **~13.8h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[ad4b266](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/ad4b26610aa6a7f4903b6065a8287f058c5fa757)** - V1 - feat: Implement Kanban system for production order management, including detailed completed order and stock handling, debug removal.
  - Linhas: **816** (+381/-435) | Tempo: **4-6 h**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[12a5140](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/12a51404449179449e777299a2ae26d7f673ea33)** - V1 - Build and estoque button correctly naming and function review
  - Linhas: **145** (+78/-67) | Tempo: **1-2 h**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

- **[05ed0dd](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/05ed0ddc88040c90ba87339c2e0171b5daab43eb)** - V1 - 3s pooling, login validation
  - Linhas: **1436** (+183/-1253) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[f474bcc](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/f474bcc37c33fad850f1f8469cbed84e21f9f5b7)** - V1 - Polling on rollback
  - Linhas: **11** (+10/-1) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### quarta-feira, 28/01/2026

**2 commits** | **2547 linhas** | **~12h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[e47ee8f](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/e47ee8ffcad73fdc6d70601e3dfd41ab98fb4d7f)** - V1 - Performance improvement
  - Linhas: **1628** (+1070/-558) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[05fc033](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/05fc0332633b863640a6455ef0982656e1b66a43)** - V1 - feat: Implement Kanban board with order, stock, and multi-type document upload modals.
  - Linhas: **919** (+847/-72) | Tempo: **4-6 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### terça-feira, 27/01/2026

** commits** | **2068 linhas** | **~7h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[79bdc37](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/79bdc37cc3112f0e2ddb2ed8bfad01e4b1b04bed)** - V1 - prototipo extra├º├úo
  - Linhas: **2068** (+1535/-533) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### segunda-feira, 26/01/2026

**13 commits** | **3905 linhas** | **~24.6h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[074d9d3](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/074d9d3a203247c0ba5a419f5684eed964e0a169)** - V1 - Colunas e teste deploy
  - Linhas: **1484** (+1174/-310) | Tempo: **6-8 h+**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[b7abdbe](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/b7abdbee4531adf16ddcf3285bed79bfa193b01b)** - V1 - deploy
  - Linhas: **55** (+48/-7) | Tempo: **30-60 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[082be32](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/082be32093b182a48b3d21f8e6391f0598ab26ae)** - V1 - deploy
  - Linhas: **13** (+12/-1) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[3b2e808](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/3b2e808fc8979602520ea299ee39dcff1911c565)** - V1 - deploy ssh
  - Linhas: **14** (+11/-3) | Tempo: **15-30 min**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[6ed943a](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/6ed943a2afb56b781ad09ead4ebccabefb86b181)** - V1 - Deploy password ssh
  - Linhas: **85** (+60/-25) | Tempo: **1-2 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[7df41a3](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/7df41a30a65c6f9e1057237b402317544a9b0d9b)** - V1 - fix
  - Linhas: **21** (+16/-5) | Tempo: **15-30 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[1dc59e4](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/1dc59e4858b2bc3307bd75cc1c0dc8f2a2d758e4)** - V1 - fix anti gravity
  - Linhas: **30** (+15/-15) | Tempo: **30-60 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[cd4d363](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/cd4d363b876aec6c6423c519b7e9e6fb9b044ed5)** - teste
  - Linhas: **22** (+11/-11) | Tempo: **15-30 min**
  - Impacto: Qualidade - aumenta confianca em regressoes e releases.

- **[333ce95](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/333ce9541889451fbac35c3b75030df9012018e8)** - V1 - On the line
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[7b369a7](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/7b369a73657f8a656c87b50ad575d1e66d0cbf02)** - V1 - On the line mesmo
  - Linhas: **16** (+8/-8) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[f3cd32e](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/f3cd32ea39485d4d9ddec90e2b4926eace75967f)** - V1 - Retroceder, auto IA
  - Linhas: **1383** (+767/-616) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[7b6501d](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/7b6501d2ab3f699a9c02ca1cf5c066c9adc74918)** - V1 - Deploy and base to doc upload
  - Linhas: **748** (+633/-115) | Tempo: **4-6 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

- **[c5a3f42](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/c5a3f42c805fcf3071cf0698eef2502d23cfd204)** - V1 - Implement UUID generation utility and update API to use it
  - Linhas: **32** (+28/-4) | Tempo: **30-60 min**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### sexta-feira, 23/01/2026

**4 commits** | **4104 linhas** | **~18.5h estimadas**

#### Anomalias de Transporte ("rodrigolessa1980/Anomalias-Transporte")

- **[cdf0e0d](https://github.com/rodrigolessa1980/Anomalias-Transporte/commit/cdf0e0dbf6c40624d2af0276a2fa0d2eaa284f54)** - [Fix] Reports Date Persistence
  - Linhas: **107** (+5/-102) | Tempo: **1-2 h**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[7228f6d](https://github.com/rodrigolessa1980/Anomalias-Transporte/commit/7228f6d062edf38c2e5e931301517f008d0b22c7)** - redepo
  - Linhas: **1925** (+958/-967) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[9eb6efa](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/9eb6efa56ee2f5a3f8f1110ac6f9bbe0a0c1ef2f)** - V1 - [Feature] Implement functionality to view and manage historical invoices and packing lists. Added a modal to display the last invoice and packing list associated with a pedido, including detailed...
  - Linhas: **498** (+469/-29) | Tempo: **2-4 h**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[e112883](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/e112883fde4cb3fa7935f3e09fa3b1fcdd7cb463)** - V1 - [Feature] Implement batch order creation and administrative functionalities. Added a new endpoint for batch processing of pedidos, allowing for simultaneous creation and file uploads with error h...
  - Linhas: **1574** (+1372/-202) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### quinta-feira, 22/01/2026

**4 commits** | **6052 linhas** | **~14.5h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[dcd9cc7](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/dcd9cc761cb6ca54c7017e32291717692749383c)** - V1 - Refactor inventory and order processing logic. Updated the saldo calculation in the estoque_produtos table to reflect the correct formula. Enhanced error handling in the server to manage uncaught...
  - Linhas: **3979** (+3487/-492) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[687ab97](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/687ab97263dd38936bc9cb391ab6c041768a8459)** - V1 - Enhance server configuration and error handling. Updated .env file loading to use the server directory path, added debug logs to verify environment variable loading, and implemented validation fo...
  - Linhas: **23** (+22/-1) | Tempo: **15-30 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[ff512bc](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/ff512bcdc381f0341134bb8e205ca05ec979cc8d)** - V1 - Refactor server structure and enhance document upload functionality. Modularized server routes and configurations for better organization, including centralized database connection and multer set...
  - Linhas: **2048** (+1827/-221) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[824114c](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/824114c3607b36fc9248797cf9737c26627d69d6)** - Merge branch 'main' of https://github.com/rodrigolessa1980/linha-produ-o-petkov
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### quarta-feira, 21/01/2026

** commits** | **2079 linhas** | **~7h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[2579a55](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/2579a5501e538940befdf313389fd76479e8e623)** - V1 - Enhance inventory management and order processing features. Added new functionality for tracking stock adjustments through the introduction of the estoque_baixas table, allowing for detailed reco...
  - Linhas: **2079** (+1829/-250) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

---

### terça-feira, 20/01/2026

**2 commits** | **2255 linhas** | **~8.5h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[b10544f](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/b10544f14235f2252d986f06bec2756fa419ae75)** - V1 - Restructure production flow and enhance document handling. Updated the production process to include mandatory fields for "Quantidade Produzida" and "Quantidade embarcada". Removed the unused "Pe...
  - Linhas: **2059** (+1395/-664) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[1a5ee40](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/1a5ee40fc17295581a19591dbd15a1b5cd0de933)** - V1 - Enhance Kanban components and document handling. Added functionality to calculate completed stages based on the current stage, optimizing the retrieval of documents for orders. Updated the Pipeli...
  - Linhas: **196** (+173/-23) | Tempo: **1-2 h**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

---

### segunda-feira, 19/01/2026

**3 commits** | **3731 linhas** | **~17h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[fd8dd5a](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/fd8dd5a92e4a1a009546fb2949912234d2fe987e)** - V1 - Implement Excel data extraction feature and enhance document handling. Added a new endpoint for extracting data from Excel files, integrated extraction logic in the modal for creating orders, and...
  - Linhas: **1913** (+1706/-207) | Tempo: **6-8 h+**
  - Impacto: Funcional - entrega capacidade nova ou amplia valor do produto.

- **[3759838](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/3759838866f01ea765bd718db1e3f8c00ce4279c)** - V1 - Enhance date handling and improve order processing in modals. Updated MySQL connection to treat DATETIME/TIMESTAMP as UTC, ensuring consistent date formatting. Refactored date parsing logic in ut...
  - Linhas: **303** (+195/-108) | Tempo: **2-4 h**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

- **[d2c5205](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/d2c5205b25fff774aafdbfd048856c3931cecb13)** - V1 - Refactor Kanban components to enhance filtering and sorting capabilities. Introduced props for filtering in PedidosConcluidos and PedidosFalhaPosProducao components, allowing for dynamic search f...
  - Linhas: **1515** (+884/-631) | Tempo: **6-8 h+**
  - Impacto: Manutencao tecnica - codigo mais limpo, menor custo de evolucao futura.

---

### sexta-feira, 16/01/2026

**2 commits** | **11212 linhas** | **~14h estimadas**

#### Linha de ProduÃ§Ã£o Petkov ("rodrigolessa1980/linha-produ-o-petkov")

- **[51d4d79](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/51d4d79919df2e9398f17f849db35a991aca93df)** - base v1
  - Linhas: **8053** (+7422/-631) | Tempo: **6-8 h+**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[0896714](https://github.com/rodrigolessa1980/linha-produ-o-petkov/commit/089671457d7a1478b54a97daf83ced42d920bc5d)** - V1 - Refactor PipelineBoard and modals to improve state management and performance. Introduced memoization for active orders and added new modal states for better handling of user interactions. Enhanc...
  - Linhas: **3159** (+1843/-1316) | Tempo: **6-8 h+**
  - Impacto: Infraestrutura - melhora deploy, ambiente ou confiabilidade de entrega.

---

### quarta-feira, 14/01/2026

** commits** | **149 linhas** | **~1.5h estimadas**

#### Voda App ("Monkey-Branch/vodaapp")

- **[529e1ac](https://github.com/Monkey-Branch/vodaapp/commit/529e1ac3699150f66bc7d966d83ef71eccde2f49)** - Revert "resolvido background branco em algumas telas" This reverts commit ef044961268a4e12da0269d0d2cb274dc13670b7.
  - Linhas: **149** (+49/-100) | Tempo: **1-2 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### terça-feira, 13/01/2026

**3 commits** | **164 linhas** | **~2.4h estimadas**

#### Anomalias de Transporte ("rodrigolessa1980/Anomalias-Transporte")

- **[1bc7f68](https://github.com/rodrigolessa1980/Anomalias-Transporte/commit/1bc7f68d2bc994abc2eee71322450a902a1b0da3)** - dashboard bug fix
  - Linhas: **74** (+18/-56) | Tempo: **30-60 min**
  - Impacto: Estabilidade - corrige comportamento incorreto e reduz risco operacional.

- **[822c6e4](https://github.com/rodrigolessa1980/Anomalias-Transporte/commit/822c6e4da69eafb3ad25c7d09b557bd987f5dd6f)** - redepo
  - Linhas: **2** (+1/-1) | Tempo: **5-15 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[bd7125e](https://github.com/rodrigolessa1980/Anomalias-Transporte/commit/bd7125eb4a55ddccd6c77857a089123a230f1218)** - build optimizations
  - Linhas: **88** (+66/-22) | Tempo: **1-2 h**
  - Impacto: Experiencia - melhora visual/usabilidade percebida pelo usuario.

---

### segunda-feira, 12/01/2026

** commits** | **0 linhas** | **~0.2h estimadas**

#### Rastreio de Container ("rodrigolessa1980/rastreio-de-container")

- **[0a25a50](https://github.com/rodrigolessa1980/rastreio-de-container/commit/0a25a50c27c6d901d80196f55b95faeef6f833e1)** - logo
  - Linhas: **0** (+0/-0) | Tempo: **5-15 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### sexta-feira, 09/01/2026

**3 commits** | **983 linhas** | **~6.8h estimadas**

#### Rastreio de Container ("rodrigolessa1980/rastreio-de-container")

- **[643f12c](https://github.com/rodrigolessa1980/rastreio-de-container/commit/643f12c2b0b76787b3fb8ff06496f0316081c89f)** - abas
  - Linhas: **107** (+86/-21) | Tempo: **1-2 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[8b5bba1](https://github.com/rodrigolessa1980/rastreio-de-container/commit/8b5bba1a04eb0b8c40c0cc379899416b4da88865)** - containeer atualiza├º├úo peri├│dica e tag para as notas
  - Linhas: **860** (+816/-44) | Tempo: **4-6 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

- **[8c3d75a](https://github.com/rodrigolessa1980/rastreio-de-container/commit/8c3d75ad77f1b868de8fceeffcb99d2031f10c91)** - rota errada
  - Linhas: **16** (+10/-6) | Tempo: **15-30 min**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### quinta-feira, 08/01/2026

** commits** | **149 linhas** | **~1.5h estimadas**

#### Voda App ("Monkey-Branch/vodaapp")

- **[ef04496](https://github.com/Monkey-Branch/vodaapp/commit/ef044961268a4e12da0269d0d2cb274dc13670b7)** - resolvido background branco em algumas telas
  - Linhas: **149** (+100/-49) | Tempo: **1-2 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

### quarta-feira, 07/01/2026

** commits** | **122 linhas** | **~1.5h estimadas**

#### Rastreio de Container ("rodrigolessa1980/rastreio-de-container")

- **[8e7df03](https://github.com/rodrigolessa1980/rastreio-de-container/commit/8e7df033def449d391be9d982c40ff8a64dc14ed)** - Adiciona atualiza├º├úo autom├ítica a cada 30 segundos para containers e cota├º├Áes, al├®m de exibir a ├║ltima atualiza├º├úo na interface.
  - Linhas: **122** (+85/-37) | Tempo: **1-2 h**
  - Impacto: Evolucao incremental - melhoria pontual no repositorio.

---

