const express = require("express");
const requestAPI = require("request");

const app = express(); //вызов приложения
const port = 3000;

app.set("view engine", "hbs");
app.set("view options", {layout: "layout"});

app.get("/", (request, response) => {
    const url = "https://www.cbr-xml-daily.ru/daily_json.js";

    requestAPI(url, (error, request2, data) => {        
        let model = {
            Valute: {}
        };

        let bufRus = {
            Valute: {}
        };

        let bufModel = {
            Valute: {}
        };

        if (error) console.log(error);
        else {
            model = JSON.parse(data);

            bufRus.Valute["RUS"] = {
                ID: "0",
                NumCode: "0",
                CharCode: "RUS",
                Nominal: 1,
                Name: "Российский рубль",
                Value: 1,
                Previous: 1
            };

            /*model.Valute["RUS"] = {
                ID: "R0",
                NumCode: "0",
                CharCode: "RUS",
                Nominal: 1,
                Name: "Российский рубль",
                Value: 1,
                Previous: 1
            };*/

            bufModel.Valute = Object.assign(bufRus.Valute, model.Valute);

            var index = 1;

            for (const key in bufModel.Valute) {
                
                const element = bufModel.Valute[key];
                //
                element.ID = index;
                index += 1;
                //
                element.Value = Math.round((element.Value / element.Nominal) * 1000) / 1000;
                element.DeValue = Math.round((1 / element.Value) * 1000) / 1000;
            }


        }     
        response.render("main", bufModel);
    });
}); //обработчик маршрутов

app.get("/*", (request, response) => {
    response.redirect("/");
}); //обработчик маршрутов

app.listen(port, () => {
    console.log(`App is running http://localhost:${port}`);
});