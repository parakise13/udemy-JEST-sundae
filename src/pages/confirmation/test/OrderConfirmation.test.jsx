import { render, screen } from "../../../test-utils/testing-library-utils";
import { rest } from "msw";
import { server } from "../../../mocks/server";
import OrderConfirmation from "../OrderConfirmation";

test("error response from server for submitting order", async () => {
    server.resetHandlers(
        rest.get("http://localhost:3000/order", (req, res, ctx) => {
            return rest(ctx.status(500));
        })
    );

    render(<OrderConfirmation setOrderPhase={jest.fn()} />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
        "An unexpected error occurred. Please try again later."
    );
});
