import axios from "axios";
import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import ScoopOption from "./ScoopOption";
import ToppingOption from "./ToppingOption";
import AlertBanner from "../common/AlertBanner";
import { pricePerItem } from "../../constants";
import { formatCurrency } from "../../utilities";
import { useOrderDetails } from "../../contexts/OrderDetails";

export default function Options({ optionType }) {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(false);
    const { totals } = useOrderDetails();

    // optionType is 'scoops' or 'toppings'
    useEffect(() => {
        // create an abortController to attach to network request
        const controller = new AbortController();
        // signal 옵션을 주면 axios 호출에서 이 컨트롤러를 확인하고 이 컨트롤러를 중단하면 axios 호출이 중단된다.
        axios
            .get(`http://localhost:3000/${optionType}`, {
                signal: controller.signal,
            })
            .then((response) => setItems(response.data))
            .catch((error) => setError(true));

        // abort axios call on component unmount
        return () => {
            controller.abort();
        };
    }, [optionType]);

    if (error) {
        // @ts-ignore
        return <AlertBanner />;
    }

    const ItemComponent = optionType === "scoops" ? ScoopOption : ToppingOption;
    const title =
        optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();

    const optionItems = items.map((item) => (
        <ItemComponent
            key={item.name}
            name={item.name}
            imagePath={item.imagePath}
        />
    ));

    return (
        <>
            <h2>{title}</h2>
            <p>{formatCurrency(pricePerItem[optionType])} each</p>
            <p>
                {title} total: {formatCurrency(totals[optionType])}
            </p>
            <Row>{optionItems}</Row>
        </>
    );
}
