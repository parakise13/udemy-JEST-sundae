import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";

// 기능테스트
test("update scoop subtotal when scoops change", async () => {
    const user = userEvent.setup();
    render(<Options optionType="scoops" />);

    // make sure total starts out at $0.00
    const scoopSubtotal = screen.getByText("Scoops total: $", { exact: false }); // exact 옵션을 주면 일치하는 일부의 text만 check한다. default는 true
    expect(scoopSubtotal).toHaveTextContent("0.00");

    // update vanilla scoops to 1, and check subtotal
    // await & find 필요 => 서버에서 옵션을 받을때 까지는 채우지않도록
    const vanillaInput = await screen.findByRole("spinbutton", {
        name: "Vanilla",
    });

    // 사용자 인스턴스를 가져와 clear를 먼저 실행.
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1"); // input에 number를 받더라도 문자열로 넣어야함.
    expect(scoopSubtotal).toHaveTextContent("2.00");

    // update chocolate scoops to 2 and check subtotal
    const chocolateInput = await screen.findByRole("spinbutton", {
        name: "Chocolate",
    });

    await user.clear(chocolateInput);
    await user.type(chocolateInput, "2");
    expect(scoopSubtotal).toHaveTextContent("6.00");
});
