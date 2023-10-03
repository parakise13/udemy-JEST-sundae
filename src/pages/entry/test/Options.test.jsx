import React from "react";
import { render, screen } from "../../../test-utils/testing-library-utils";

import Options from "../Options";
import userEvent from "@testing-library/user-event";

// 서버에서 반환할 각 옵션의 이미지를 띄우는지만 테스트

test("displays image for each scoop option from server", async () => {
    render(<Options optionType="scoops" />);

    //find image
    // 참고: 정규식 끝의 $는 문자열이 scoop으로 끝난다는 것을 의미
    // const scoopImages = screen.getAllByRole("img", { name: /scoop$/i });
    const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
    expect(scoopImages).toHaveLength(2);

    // 이미지를 구체적으로 특정
    // confirm alt text of images
    const altText = scoopImages.map((element) => element.alt);
    // 배열과 객체는 toEqual 매처를 사용해야함
    expect(altText).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});

test("displays image for each toppings option from server", async () => {
    render(<Options optionType="toppings" />);

    const images = await screen.findAllByRole("img", {
        name: /topping$/i,
    });
    expect(images).toHaveLength(3);

    const imageTitles = images.map((img) => img.alt);
    expect(imageTitles).toEqual([
        "Cherries topping",
        "M&Ms topping",
        "Hot fudge topping",
    ]);
});

test("don't update total if scoops input is invalid", async () => {
    const user = userEvent.setup();
    render(<Options optionType="scoops" />);

    // wait for the vanilla input to appear after server call
    const vanillaInput = await screen.findByRole("spinbutton", {
        name: "Vanilla",
    });

    // find the scoops subtotal, which starts out at 0
    const scoopsSubtotal = screen.getByText("Scoops total: $0.00");

    // clear the input
    await user.clear(vanillaInput);

    // .type() will type one character at a time
    await user.type(vanillaInput, "2.5");

    // make sure scoops subtotal hasn't updated
    expect(scoopsSubtotal).toHaveTextContent("$0.00");

    // do the same test for "100"
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "100");
    expect(scoopsSubtotal).toHaveTextContent("$0.00");

    // and for -1
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "-1");
    expect(scoopsSubtotal).toHaveTextContent("$0.00");
});
