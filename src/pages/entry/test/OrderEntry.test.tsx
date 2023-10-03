import {
    render,
    screen,
    waitFor,
} from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";
import { rest } from "msw";
import { server } from "../../../mocks/server";
import userEvent from "@testing-library/user-event";
import React from "react";

test("handles error for scoops and toppings routes", async () => {
    // server orverride 하기
    server.resetHandlers(
        rest.get("http://localhost:3000/scoops", (req, res, ctx) => {
            return res(ctx.status(500));
        }),
        rest.get("http://localhost:3000/toppings", (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    render(<OrderEntry setOrderPhase={jest.fn()} />);

    // axios에서 catch 함수가 실행될 때까지 경고창은 나타나지 않기때문에 비동기 find 사용
    await waitFor(async () => {
        const alerts = await screen.findAllByRole("alert");

        expect(alerts).toHaveLength(2);
    });
});

test("disable order button if there are no scoops ordered", async () => {
    const user = userEvent.setup();
    render(<OrderEntry setOrderPhase={jest.fn()} />);

    //order button should be disabled at first, even before options load
    const orderButton = screen.getByRole("button", { name: /order sundae/i });
    expect(orderButton).toBeDisabled();

    //expect button to be enabled after adding scoop
    const vanillaInput = await screen.findByRole("spinbutton", {
        name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(orderButton).toBeEnabled();

    // expect button to be disabled again after removing scoop
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "0");
    expect(orderButton).toBeDisabled();
});
