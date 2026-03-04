# Tetris Multiplayer

## What This Is

Um jogo de Tetris multiplayer competitivo para web, onde até 4 jogadores jogam simultaneamente em tempo real. Jogadores criam salas com código de acesso, competem enviando linhas de lixo uns aos outros, e o último sobrevivente vence. Visual retrô pixel art estilo arcade.

## Core Value

Partidas multiplayer em tempo real funcionando sem lag — 4 jogadores vendo seus campos e os campos dos adversários atualizados instantaneamente.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Jogo de Tetris funcional com mecânicas clássicas (rotação, queda, linhas)
- [ ] Multiplayer tempo real com até 4 jogadores simultâneos
- [ ] Sistema de salas com código/link de acesso
- [ ] Mecânica de lixo — linhas completadas enviam linhas de lixo aos adversários
- [ ] Layout com campo principal grande + 3 campos mini dos oponentes
- [ ] Eliminação progressiva — último jogador de pé vence
- [ ] Entrada casual com nickname (sem cadastro)
- [ ] Visual retrô/pixel art estilo arcade
- [ ] Comunicação em tempo real via WebSockets

### Out of Scope

- Matchmaking automático — v1 só salas com código
- Sistema de contas/login — casual apenas
- Ranking global/histórico — sem persistência de dados do jogador
- Mobile nativo — web only
- Chat entre jogadores — foco no gameplay
- Modos cooperativos/times — competitivo free-for-all apenas

## Context

- Tetris tem mecânicas bem definidas (SRS rotation system, bag randomizer, wall kicks)
- Multiplayer Tetris competitivo é um gênero estabelecido (Tetris 99, Jstris, Tetr.io)
- A mecânica de "garbage lines" é padrão no gênero — linhas incompletas empurradas de baixo
- WebSockets é o padrão para jogos web tempo real com baixa latência
- Pixel art facilita a renderização e combina com a estética clássica do Tetris

## Constraints

- **Plataforma**: Web browser — deve funcionar em navegadores modernos (Chrome, Firefox, Safari, Edge)
- **Jogadores**: Suporte a exatamente 2-4 jogadores por sala
- **Latência**: Comunicação em tempo real precisa ser rápida o suficiente para gameplay fluido (~60fps visual, sync de estado frequente)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Casual sem conta | Reduz fricção de entrada, foco no gameplay | — Pending |
| Salas com código apenas | Mais simples que matchmaking, suficiente para v1 | — Pending |
| Visual retrô/pixel art | Combina com estética Tetris, mais simples de implementar | — Pending |
| Último de pé vence | Mecânica padrão do gênero battle royale Tetris | — Pending |

---
*Last updated: 2026-03-04 after initialization*
