import { render } from "@testing-library/react";
import { OrderDetailsProvider } from "../contexts/OrderDetails";

const renderWithContext = (ui, options) =>
    render(ui, { wrapper: OrderDetailsProvider, ...options });

// re0export everything
export * from "@testing-library/react";

// override render method
export { renderWithContext as render };

// 이렇게 하면 renderWithContext가 필요하면 이 파일에서 가져오고
// 필요하지 않으면 testing-library/react에서 바로 가져온다.
