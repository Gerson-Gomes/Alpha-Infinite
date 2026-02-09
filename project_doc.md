This is the documentation of the project

---

# 💳 InfinitePay Desktop Simulator (IP-Sim)

**Versão:** 1.0.0-alpha
**Status:** Em Desenvolvimento

## 1. Visão Geral

O **IP-Sim** é uma aplicação desktop híbrida que simula o ecossistema de pagamentos da **InfinitePay (Cloudwalk)**. O objetivo é criar um laboratório controlado para estudar concorrência, consistência de dados financeiros, segurança (PCI-DSS simplificado) e arquitetura de software.

A aplicação roda um servidor local robusto (Java) e utiliza o navegador padrão do sistema operacional em modo "App" (Kiosk/Chromeless) para renderizar a interface, eliminando a necessidade de frameworks pesados como Electron, mantendo o executável leve e performático.

## 2. Stack Tecnológico

### Backend (Core & Business Logic)

* **Linguagem:** Java 21 (LTS)
* **Framework:** Spring Boot 3.2 (Web, Validation, Data JPA)
* **Banco de Dados:** H2 Database (Em memória/Arquivo local para portabilidade) ou SQLite.
* **Build Tool:** Maven.

### Frontend (Interface & Interatividade)

* **Estrutura:** HTML5 Semântico & CSS3 (Grid/Flexbox).
* **Linguagem:** TypeScript (compilado para ES6 JavaScript).
* **Estilização:** TailwindCSS (via CDN ou build process) ou CSS Nativo Modular.
* **Comunicação:** Fetch API (REST).

### Runtime (Desktop Environment)

* **Container:** Navegador Padrão do SO (Chrome/Edge/Brave).
* **Modo de Execução:** Flag `--app=http://localhost:8080` (Janela nativa sem barra de endereços).

---

## 3. Arquitetura: Monolito em Camadas

O projeto segue uma arquitetura **Monolítica Modular**, onde o Frontend é servido como recurso estático pelo próprio Backend. Não há separação de deploy; tudo é empacotado em um único `.jar`.

### Fluxo de Dados

1. **Presentation Layer (Frontend):** O usuário interage com a "Maquininha Virtual" (HTML/JS).
2. **Controller Layer (Java):** Recebe requisições HTTP (REST DTOs).
3. **Service Layer (Java):** Aplica regras de negócio (Cálculo de taxas InfinitePay, Validação Anti-Fraude).
4. **Repository Layer (Java):** Abstração de persistência (Spring Data JPA).
5. **Database:** Persistência relacional.

---

## 4. Foco de Implementação: O "Jeito InfinitePay"

Para alinhar o projeto com a realidade da Cloudwalk/InfinitePay, as seguintes regras de negócio são prioritárias:

1. **MDR Dinâmico (Merchant Discount Rate):**
* Implementar a lógica de taxas "InfinitePay": Débito (x%), Crédito à vista (y%), Crédito 12x (z%).
* O simulador deve mostrar ao usuário quanto ele receberá líquido na hora (`ReceivableAmount`).


2. **Recebimento na Hora (Liquidação):**
* Diferente de gateways tradicionais (D+30), o sistema deve simular a liquidação imediata (D+0) no saldo da conta virtual.


3. **SmartPOS Interface:**
* O frontend deve ter o *look-and-feel* de uma máquina Android (SmartPOS), responsivo e com teclado numérico virtual.



---

## 5. Estrutura de Pastas e Arquivos

A estrutura reflete a separação lógica dentro do monólito. O Frontend vive dentro de `resources/static`, enquanto o TypeScript é desenvolvido em `src/main/frontend` e compilado para lá.

```text
infinitepay-sim/
├── pom.xml                   # Dependências Maven
├── mvnw                      # Wrapper Maven
├── start-app.sh              # Script de lançamento (Java + Browser Launch)
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── cloudwalk/
│   │   │           └── ipsim/
│   │   │               ├── IpSimApplication.java    # Main Class
│   │   │               ├── config/                  # Configurações (CORS, H2 Console)
│   │   │               ├── controller/              # REST Controllers (API Endpoints)
│   │   │               │   └── TransactionController.java
│   │   │               ├── service/                 # Regras de Negócio
│   │   │               │   ├── PaymentService.java  # Processamento
│   │   │               │   └── FeeService.java      # Lógica de Taxas InfinitePay
│   │   │               ├── model/                   # Entidades JPA (Banco de Dados)
│   │   │               │   ├── Transaction.java
│   │   │               │   └── Card.java
│   │   │               ├── repository/              # Interfaces JPA
│   │   │               └── dto/                     # Data Transfer Objects
│   │   │                   └── PaymentRequestDTO.java
│   │   │
│   │   ├── resources/
│   │   │   ├── application.properties    # Config do Banco e Porta (8080)
│   │   │   └── static/                   # Onde o HTML/CSS/JS final reside
│   │   │       ├── index.html            # Entry point da SPA
│   │   │       ├── css/
│   │   │       │   └── styles.css
│   │   │       └── js/
│   │   │           └── app.bundle.js     # JS compilado do TypeScript
│   │   │
│   │   └── frontend/                     # Código Fonte do Frontend (Dev)
│   │       ├── ts/
│   │       │   ├── main.ts               # Lógica de UI
│   │       │   └── api-client.ts         # Comunicação com Backend
│   │       ├── scss/                     # (Opcional) Se usar SASS
│   │       └── tsconfig.json             # Config do TypeScript
│   │
│   └── test/                             # Testes Unitários (JUnit 5)

```

---

## 6. Detalhes de Implementação do Launcher

Para que a experiência seja "Desktop", o usuário não deve abrir o navegador manualmente. O projeto deve incluir um script ou classe Java que orquestra isso.

### Exemplo de Lógica do Launcher (Java)

Ao iniciar o Spring Boot (`IpSimApplication.java`), o sistema pode detectar o SO e abrir o browser automaticamente:

```java
// Exemplo conceitual no método main ou EventListener
if (Desktop.isDesktopSupported()) {
    String url = "http://localhost:8080";
    String os = System.getProperty("os.name").toLowerCase();
    
    Runtime rt = Runtime.getRuntime();
    if (os.contains("win")) {
        // Abre Chrome em modo App no Windows
        rt.exec("cmd /c start chrome --app=" + url); 
    } else if (os.contains("nix") || os.contains("nux")) {
        // Abre Chromium/Chrome em modo App no Linux
        rt.exec(new String[]{"google-chrome", "--app=" + url});
        // Ou xdg-open se preferir o navegador padrão sem modo app
    }
}

```

## 7. Próximos Passos (Roadmap)

1. [ ] Configurar projeto Spring Boot inicial com H2.
2. [ ] Criar entidade `Transaction` e repositório.
3. [ ] Desenvolver `FeeService` com a tabela de taxas da InfinitePay.
4. [ ] Configurar ambiente TypeScript para compilar dentro de `static/js`.
5. [ ] Criar tela de "Checkout" (Teclado numérico e input de cartão).