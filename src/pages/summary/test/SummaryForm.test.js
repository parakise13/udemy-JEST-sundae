// 1. 기본적으로 체크박스에 체크되어있지 않음
// 2. 체크박스에 체크를 하면 버튼이 활성화
// 3. 체크를 해제하면 버튼이 다시 비활성화

import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SummaryForm from "../SummaryForm";

test("Inital conditions", () => {
    render(<SummaryForm />);

    const checkbox = screen.getByRole("checkbox", {
        name: /terms and conditions/i,
    });
    expect(checkbox).not.toBeChecked();

    const confirmButton = screen.getByRole("button", {
        name: /Confirm order/i,
    });
    expect(confirmButton).toBeDisabled();
});

test("checkbox disables button on first click and enables on second click", async () => {
    render(<SummaryForm />);

    const checkbox = screen.getByRole("checkbox", {
        name: /terms and conditions/i,
    });
    const confirmButton = screen.getByRole("button", {
        name: /Confirm order/i,
    });

    // fireEvent를 userEvent로 변경하기
    const user = userEvent.setup();

    // fireEvent.click(checkbox);
    await user.click(checkbox);
    expect(confirmButton).toBeEnabled();

    // fireEvent.click(checkbox);
    await user.click(checkbox);
    expect(confirmButton).toBeDisabled();
});

test("popover resdons to hover", async () => {
    const user = userEvent.setup();
    render(<SummaryForm />);

    // popover starts out hidden
    const nullPopover = screen.queryByText(
        /no ice cream will actually be delivered/i
    );
    expect(nullPopover).not.toBeInTheDocument();

    // popover appears on mouseover of checkbox label
    const termsAndConditions = screen.getByText(/terms and conditions/i);
    await user.hover(termsAndConditions);
    const popover = screen.getByText(
        /no ice cream will actually be delivered/i
    );
    expect(popover).toBeInTheDocument();

    // popover disappears when we mouse out
    await user.unhover(termsAndConditions);
    expect(nullPopover).not.toBeInTheDocument();
});
