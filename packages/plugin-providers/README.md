# @everywhere-harness/plugin-providers

Bundle para adicionar o provider **Omniroute**, compatível com OpenAI Chat Completions, ao Everywhere Harness.

- **Endpoint padrão:** `http://localhost:2028/v1`
- **Listagem de modelos:** `GET http://localhost:2028/v1/models` (via descoberta do Harness)
- **Protocolo:** `openai-completions`
- **Provider/route:** `custom-providers` (nome exibido: `Omniroute`)
- **Modelos:** catálogo default do endpoint configurado para aparecer nos seletores

O pacote estende a configuração do adaptador `@deepseek-ai/dsh-llm-pi-ai`, mantendo as rotas que já existiam e adicionando `custom-providers` como **Custom Model API** compatível com OpenAI Chat Completions. A configuração inclui modelos default do catálogo Omniroute para que a rota possa ser escolhida no chat.

## Credencial

A credencial é referenciada pelo nome `OMNIROUTE_API_KEY` e deve ser armazenada pelo Harness em **Settings → Models**. O valor secreto não fica no pacote nem no `cordis.patch.yml`; cadastre/atualize a chave usando o campo API key dessa rota antes de fazer chamadas. Se seu servidor não exigir autenticação, você pode deixar essa referência sem valor e remover `apiKeyEnv` do perfil no arquivo `cordis.patch.yml`.

A referência é apenas o nome da variável/chave: nenhum segredo é incluído no pacote. Se o processo do Harness roda em outra máquina ou container, `localhost` aponta para esse ambiente do Harness, não para o navegador.

## Personalizar

Abra **Settings → Models** para revisar a rota `custom-providers`, inserir a chave no campo API key e, se quiser, atualizar o catálogo. A rota deve aparecer nos seletores do chat com os modelos listados nesta configuração.
