import { render, screen, waitFor } from "@testing-library/react";
import OrderEntry from "../OrderEntry";
import { rest } from "msw";
import { server } from "../../../mocks/server";

test("handles error for scoops and toppings routes", async () => {
    // server orverride 하기
    server.resetHandlers(
        rest.get("http://localhost:3000/scoops", (req, res, ctx) => {
            res(ctx.status(500));
        }),
        rest.get("http://localhost:3000/toppings", (req, res, ctx) => {
            res(ctx.status(500));
        })
    );

    render(<OrderEntry />);

    // axios에서 catch 함수가 실행될 때까지 경고창은 나타나지 않기때문에 비동기 find 사용
    await waitFor(async () => {
        const alerts = await screen.findAllByRole("alert");

        expect(alerts).toHaveLength(2);
    });
});
