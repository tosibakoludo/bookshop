function dohvatiPodatke(nazivIzvora, callBack) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callBack(JSON.parse(xhr.response));
        }
    })

    xhr.open("GET", "assets/data/" + nazivIzvora);
    xhr.send();
}

let pisci;
let zanrovi;

let stanje = document.querySelectorAll(".stanje");
stanje.forEach(elem => {
    elem.addEventListener("change", filterChange);
})

document.getElementById("pretraga").addEventListener("keyup", filterChange);

document.getElementById("rang").addEventListener("change", filterChange);

document.getElementById("sort").addEventListener("change", filterChange);

// function ispisiFilterPisaca(data) {
//     console.log(data);
// }

//arrow function expression
const ispisiFilterPisaca = (data) => {
    // console.log(data);
    pisci = data;
    let ispis = '';
    data.forEach(elem => {
        ispis += `<li class="list-group-item">
        <input type="checkbox" value="${elem.id}" class="pisac" name="pisci"/> ${elem.ime} ${elem.prezime}
     <span id="countPisac${elem.id}"> </span></li>`
    });
    document.getElementById("pisci").innerHTML = ispis;

    let chekPisci = document.querySelectorAll(".pisac");
    for (let i = 0; i < chekPisci.length; i++) {
        chekPisci[i].addEventListener("change", filterChange);
    }
}

dohvatiPodatke("pisci.json", ispisiFilterPisaca);
dohvatiPodatke("zanrovi.json", ispisiZanrove);
dohvatiPodatke("knjige.json", ispisiKnjige);

function ispisiZanrove(data) {
    zanrovi = data;
    let ispis = "";
    data.forEach(elem => {
        ispis += `<li class="list-group-item">
        <input type="checkbox" value="${elem.id}" class="zanr" name="zanrovi"/> ${elem.naziv}
     <span id="countZanr${elem.id}"> </span></li>`
    });
    document.getElementById("zanrovi").innerHTML = ispis;

    let chekZanr = document.querySelectorAll(".zanr");
    for (let i = 0; i < chekZanr.length; i++) {
        chekZanr[i].addEventListener("change", filterChange);
    }
}

function filterChange() {
    dohvatiPodatke("knjige.json", ispisiKnjige);
}

function countZanr(data) {
    let countSpanoviZaZanrove = document.querySelectorAll(".zanr + span");

    countSpanoviZaZanrove.forEach(element => {
        element.innerHTML = "(0)";
        // element.parentElement.style.visibility = "visible";
        element.parentElement.style.display = "block";
    });

    let nizZanrova = data.map(elem => elem.zanrovi);

    let counter = {};
    for (element of nizZanrova.flat()) {
        if (counter[element]) {
            counter[element] += 1;
        } else {
            counter[element] = 1;
        }
    };

    for (let key in counter) {
        document.getElementById(`countZanr${key}`).innerHTML = `(${counter[key]})`;
    }

    countSpanoviZaZanrove.forEach(element => {
        if (element.innerHTML == "(0)") {
            // element.parentElement.style.visibility = "hidden";
            element.parentElement.style.display = "none";
        }
    });
}

function countPisac(data) {
    let countSpanoviZaPisce = document.querySelectorAll(".pisac + span");

    countSpanoviZaPisce.forEach(element => {
        element.innerHTML = "(0)";
        // element.parentElement.style.visibility = "visible";
        element.parentElement.style.display = "block";
    });

    let nizPisaca = data.map(elem => elem.pisacID);

    let counter = {};
    for (element of nizPisaca) {
        if (counter[element]) {
            counter[element] += 1;
        } else {
            counter[element] = 1;
        }
    };

    for (let key in counter) {
        document.getElementById(`countPisac${key}`).innerHTML = `(${counter[key]})`;
    }

    countSpanoviZaPisce.forEach(element => {
        if (element.innerHTML == "(0)") {
            // element.parentElement.style.visibility = "hidden";
            element.parentElement.style.display = "none";
        }
    });
}

const naStanjuText = document.querySelector("#btnNaStanju").nextSibling.textContent;
const nijeNaStanjuText = document.querySelector("#btnNijeNaStanju").nextSibling.textContent;

function countStanja(data) {
    let naStanju = data.filter(elem => elem.naStanju).length;
    let nijeNaStanju = data.filter(elem => !elem.naStanju).length;
    document.querySelector("#btnNaStanju").nextSibling.textContent = `${naStanjuText} (${naStanju})`;
    document.querySelector("#btnNijeNaStanju").nextSibling.textContent = `${nijeNaStanjuText} (${nijeNaStanju})`;
}

let span = document.createElement("span");
span.setAttribute("id", "countNaslove");
document.getElementById("pretraga").after(span);

function countPretragaPoNaslovu(data) {
    document.getElementById("countNaslove").innerHTML = ` (${data.length})`;
}

function countPoCeni(data) {
    let cenat = parseInt(document.getElementById("rang").value);
    document.getElementById("rez").textContent = `${cenat} (${data.length})`;
}

function ispisiKnjige(data) {
    data = filterCena(data);
    data = filterPicsi(data);
    data = filterZanr(data);
    data = filterStanje(data);
    data = filterNaslov(data);
    data = sortKnjiga(data);
    countPoCeni(data);
    countZanr(data);
    countPisac(data);
    countStanja(data);
    countPretragaPoNaslovu(data);
    let ispis = "";
    data.forEach(book => {
        ispis += `<div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100">
        <img src="assets/img/${book.slika.src}" class="card-img-top" alt="${book.naslov}">
        <div class="card-body">
          <h3 class="card-title">${book.naslov}</h3>
          <h4>${dohvatiPisca(book.pisacID)}</h4>
          <h5>$${book.price.novaCena}</h5>
          <h6><s>$${book.price.staraCena}</s></h6>
          <p class="text-primary">${book.naStanju ? "Knjiga je dostupna" : "Knjiga nije dostupna"}</p>
          <p class="card-text">${dohvatiZanrove(book.zanrovi)}</p>
          <button class="btn btn-primary korpaText" data-id="${book.id}" data-naslov="${book.naslov}" data-cena="${book.price.novaCena}">Ubaci u korpu</button>
        </div>
        </div>
        </div>`
    });
    if (data.length == 0) {
        ispis = "Nema knjiga";
    }
    document.getElementById("knjige").innerHTML = ispis;

    var dugmici = document.querySelectorAll(".korpaText");
    dugmici.forEach(elem => {
        elem.addEventListener("click", dodajUKorpu);
    })
}

// let stanje = document.querySelectorAll(".stanje");

function dohvatiPisca(id) {
    // console.log(pisci);
    let nizIme = pisci.filter(elem => elem.id == id);
    // console.log(nizIme);
    let ime = nizIme[0].ime;
    let prezime = nizIme[0].prezime;
    // console.log(ime + " " + prezime);
    return ime + " " + prezime;
}

function dohvatiZanrove(nizZ) {
    let ispis = "";
    // console.log(nizZ);
    let zanroviN = zanrovi.filter(elem => nizZ.includes(elem.id));
    // console.log(zanroviN);

    // for (let i = 0; i < nizZ.length; i++) {
    //     for (let j = 0; j < zanrovi.length; j++) {
    //         if (nizZ[i] == zanrovi[j].id) {
    //             ispis += zanrovi[j].naziv;
    //             if (i != nizZ.length - 1) {
    //                 ispis += ", ";
    //                 break;
    //             }
    //         }
    //     }
    // }

    for (let i = 0; i < zanroviN.length; i++) {
        ispis += zanroviN[i].naziv;
        if (i != zanroviN.length - 1) {
            ispis += ", ";
        }
    }

    // console.log(ispis);

    return ispis;
}

function filterPicsi(data) {
    let nizChekiranihVrednosti = [];
    let nizCh = document.querySelectorAll(".pisac");
    nizCh.forEach(
        elem => {
            if (elem.checked) {
                nizChekiranihVrednosti.push(parseInt(elem.value));
            }
        }
    )
    if (nizChekiranihVrednosti.length != 0) {
        return data.filter(elem => nizChekiranihVrednosti.includes(elem.pisacID));
    }
    return data;
}

function filterZanr(data) {
    let nizChekiranihVrednosti = [];
    let nizCh = document.querySelectorAll(".zanr");
    nizCh.forEach(
        elem => {
            if (elem.checked) {
                nizChekiranihVrednosti.push(parseInt(elem.value));
            }
        }
    )
    if (nizChekiranihVrednosti.length != 0) {
        return data.filter(elem => elem.zanrovi.some(zanrID => nizChekiranihVrednosti.includes(zanrID)));//[1, 2]
    }
    return data;
}

function filterStanje(data) {
    let chekirani = document.querySelector(".stanje:checked");
    // console.log(chekirani);
    if (chekirani.value == "dostupno") {
        return data.filter(elem => elem.naStanju)
    }
    if (chekirani.value == "nedostupno") {
        return data.filter(elem => !elem.naStanju)
    }
    return data;
}

function filterNaslov(data) {
    let val = document.getElementById("pretraga").value;
    if (val) {
        return data.filter(elem => elem.naslov.toLowerCase().indexOf(val.trim().toLowerCase()) != -1);
    }
    return data;
}

function filterCena(data) {
    let cenat = parseInt(document.getElementById("rang").value);
    // document.getElementById("rez").textContent = `${cenat} (${data.length})`;
    return data.filter(elem => parseInt(elem.price.novaCena) <= cenat);
}

function sortKnjiga(data) {
    let metod = document.querySelector("#sort").value;
    if (metod == "asc") {
        return data.sort((a, b) => parseInt(a.price.novaCena) > parseInt(b.price.novaCena) ? 1 : -1);
    }
    return data.sort((a, b) => parseInt(a.price.novaCena) < parseInt(b.price.novaCena) ? 1 : -1);
}

function dodajUKorpu() {
    // let id = this.dataset.id;
    let naslov = this.dataset.naslov;
    let cena = this.dataset.cena;
    // console.log(naslov);
    let cart = [];

    const cookieCart = document.cookie.split("; ").find(row => row.startsWith("cart="));

    if (cookieCart) {
        cart = JSON.parse(cookieCart.split("=")[1]);
    }

    if (cart.some(elem => elem.book == naslov)) {
        cart.find(elem => elem.book == naslov).quantity++;
    }
    else {
        cart.push({ book: naslov, quantity: 1, cena: cena })
    }

    setCookie("cart", JSON.stringify(cart), 5);

    checkCart();
}

function setCookie(name, value, expMonth) {
    let date = new Date();
    date.setMonth(date.getMonth() + expMonth);
    document.cookie = name + "=" + value + "; expires=" + date.toUTCString();
}

function checkCart() {
    let ispis = "";
    let korpa = document.getElementById("korpa");
    const cookieCart = document.cookie.split("; ").find(row => row.startsWith("cart="));

    let cenaUk = 0;
    //cookieCart je typeof string
    if (cookieCart && cookieCart.length > 7) {
        ispis += "<ul class='list-group'>";
        let niz = JSON.parse(cookieCart.split("=")[1]);
        niz.forEach(elem => {
            cenaUk += elem.cena * elem.quantity;
            ispis += `<li class="list-group-item">${elem.book} ($${elem.cena * elem.quantity}) <span class="badge badge-primary">${elem.quantity}</span><span><input type="number" class="cart-quantity-input" min="1" value="${elem.quantity}" data-book="${elem.book}"></span><span data-book="${elem.book}" class="glyphicon glyphicon-remove"></span></li>`;
        });
        ispis += `<li class="list-group-item">Remove all ($${cenaUk}) <span data-book="all" class="glyphicon glyphicon-remove"></span></li></ul>`;
        korpa.innerHTML = ispis;
    } else {
        korpa.innerHTML = "nema nista u korpi";
    }

    document.querySelectorAll(".list-group-item .glyphicon.glyphicon-remove").forEach(elem => {
        elem.addEventListener("click", removeFromChart);
    })

    document.querySelectorAll('.cart-quantity-input').forEach(elem => {
        elem.addEventListener("change", azurirajQuantity);
    })
}

checkCart();

function removeFromChart() {
    let naslov = this.dataset.book;

    let cart = [];

    if (naslov != "all") {
        const cookieCart = document.cookie.split("; ").find(row => row.startsWith("cart="));

        if (cookieCart) {
            cart = JSON.parse(cookieCart.split("=")[1]);
        }

        cart = cart.filter(elem => elem.book != naslov);
    }

    setCookie("cart", JSON.stringify(cart), 5);

    checkCart();
}

function azurirajQuantity() {
    console.log("na dobrom si putu");

    // let id = this.dataset.id;
    let naslov = this.dataset.book;
    // console.log(naslov);
    let cart = [];

    const cookieCart = document.cookie.split("; ").find(row => row.startsWith("cart="));

    if (cookieCart) {
        cart = JSON.parse(cookieCart.split("=")[1]);
    }

    if (cart.some(elem => elem.book == naslov)) {
        console.log(this.value);
        cart.find(elem => elem.book == naslov).quantity = this.value;
    }

    setCookie("cart", JSON.stringify(cart), 5);

    checkCart();
}