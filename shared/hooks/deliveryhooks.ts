import { useEffect, useState } from "react";
import axios from "axios";

interface Street {
  Description: string;
  Ref: string;
}

export const useNovaPoshtaDelivery = (enabled: boolean, cityName = "Марганец") => {
  const [streets, setStreets] = useState<Street[]>([]);
  const [street, setStreet] = useState("");
  const [cityRef, setCityRef] = useState<string | null>(null);

  // Получение Ref города
  useEffect(() => {
    if (!enabled) {
      setCityRef(null);
      setStreets([]);
      setStreet("");
      return;
    }

    axios
      .post("https://api.novaposhta.ua/v2.0/json/", {
        apiKey: "e657cd00572f37d47b7ea5ce55999ca6",
        modelName: "Address",
        calledMethod: "getSettlements",
        methodProperties: {
          FindByString: cityName,
          Limit: 1,
        },
      })
      .then((res) => {
        const settlements = res.data.data;
        if (settlements?.length > 0) {
          setCityRef(settlements[0].Ref);
        } else {
          console.error(`Город ${cityName} не найден`);
        }
      })
      .catch((err) => {
        console.error("Ошибка получения города:", err);
      });
  }, [enabled, cityName]);

  // Получение улиц по Ref
  useEffect(() => {
    if (!cityRef) return;

    axios
      .post("https://api.novaposhta.ua/v2.0/json/", {
        apiKey: "e657cd00572f37d47b7ea5ce55999ca6",
        modelName: "Address",
        calledMethod: "getSettlementStreets",
        methodProperties: {
          SettlementRef: cityRef,
          Limit: 1500,
          Page: 1,
        },
      })
      .then((res) => {
        setStreets(res.data.data || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки улиц:", err);
      });
  }, [cityRef]);

  return {
    streets,
    street,
    setStreet,
  };
};
