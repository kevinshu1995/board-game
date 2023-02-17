import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { setupServer } from "msw/node";
import { restHandlers } from "./restHandlers";

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

vi.mock("vue-router", () => {
    return {
        useRouter: () => {
            return {
                push: vi.fn(),
            };
        },
    };
});

vi.mock("supabase", () => {
    return {
        auth: {
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(),
        },
    };
});

vi.mock("uuid", () => {
    return {
        validate: vi.fn().mockReturnValue(true),
    };
});
