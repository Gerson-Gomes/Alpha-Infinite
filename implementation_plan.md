# IP-Sim Implementation Plan

## Goal Description
Build the **InfinitePay Desktop Simulator (IP-Sim)**, a monolithic desktop application that simulates the Cloudwalk/InfinitePay payment ecosystem. The goal is to create a controlled environment for testing financial transactions, concurrency, and security.

## User Review Required
- **Architecture**: Confirming Monolithic structure with Spring Boot serving static frontend.
- **Runtime**: Using the system's default browser in `--app` mode.
- **Database**: H2 (In-memory/File) as per documentation.
- **Design**: Integrating user-provided TailwindCSS designs for Dashboard and Simulator.

## Proposed Implementation Phases

### Phase 1: Core Domain & Persistence [COMPLETED]
**Goal**: Establish the data model and persistence layer.
- [x] **Transaction Entity**: Create `Transaction.java` with fields (amount, type, status, timestamp, card details).
- [x] **Card Entity**: Create `Card.java` (if needed separate from Transaction, or embedded).
- [x] **Repositories**: Create `TransactionRepository` and `CardRepository` interfaces.

### Phase 2: Business Logic (The "InfinitePay Way") [COMPLETED]
**Goal**: Implement financial logic for MDR and Settlements.
- [x] **FeeService**: Implement `calculateNetValue` with simulated rates.
- [x] **PaymentService**: Orchestrate the flow: Validate -> Calculate Fees -> Save -> Return Response.
- [x] **Immediate Settlement**: Ensure simulated "D+0" logic.
- [x] **Tests**: Unit tests for FeeService.

### Phase 3: REST API Layer [COMPLETED]
**Goal**: Expose logic to the frontend.
- [x] **TransactionController**: Endpoints for `POST /api/pay` and `GET /api/transactions`.
- [x] **DTOs**: `PaymentRequestDTO`, `TransactionResponseDTO`.
- [x] **Error Handling**: GlobalExceptionHandler.

### Phase 4: Frontend Development
**Goal**: Create the "SmartPOS" interface adapting the provided designs.
- [ ] **Design Analysis & Setup**:
    - Integrate TailwindCSS via CDN (as per snippets).
    - Merge Dark/Light mode designs into unified `dashboard.html` and `simulator.html`.
    - Extract common logic (Sidebar navigation).
- [ ] **Dashboard (`index.html`)**:
    - Display standard IP-Sim header/sidebar.
    - Fetch and display basic stats (mocked or real from API).
    - [ ] **Integration**: Fetch recent transactions from `GET /api/transactions`.
- [ ] **Simulator (`simulator.html`)**:
    - Implement Transaction Configuration Form.
    - [ ] **Integration**: Connect "Execute Simulation" to `POST /api/transactions`.
    - Implement Log Viewer (Polled or WebSocket - simulated via polling for now).
- [ ] **TypeScript Logic**:
    - `dashboard.ts`: Stats and Table logic.
    - `simulator.ts`: Form handling and API posting.

### Phase 5: Runtime & Polish
**Goal**: Ensure smooth "App-like" experience.
- [ ] **Launcher**: Verify `IpSimApplication` opens the browser correctly on all OSs.
- [ ] **Styling**: Ensure responsive resizing and dark mode toggling.

## Verification Plan
### Automated Tests
- **Unit Tests**: JUnit 5 tests for `FeeService`.
- **Integration Tests**: `MockMvc` tests for `TransactionController`.

### Manual Verification
- **End-to-End**: Run app, use Simulator to create transactions, observe them appearing on Dashboard.
