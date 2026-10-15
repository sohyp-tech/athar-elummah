const loginButton = document.querySelector(".signin");
const userNameInput = document.querySelector(".user_name_input");
const userIdInput = document.querySelector(".user_id_input");

const postInput = document.querySelector(".post-input")
const uploadButton = document.querySelector(".upload")

if (loginButton) {
  loginButton.onclick = () => {
    if (userNameInput.value && userIdInput.value) {
      fetch("https://sohyp.pythonanywhere.com/login_user/put", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          user_name: userNameInput.value,
          user_id: parseInt(userIdInput.value)
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          document.querySelector(".login-container").innerHTML += `
          <div class="error-cont">
            <i class="fa-solid fa-warning"></i>
            <p class="error-message" >تم استخدام هذا ال اي دي من قبل. يمكنك استخدام اي دي اخر</p>
          </div>
          `;
console.log("error")
	   return;
        }
        else {
localStorage.setItem("logged", data.success_key);
        localStorage.setItem("id", parseInt(userIdInput.value));
        console.log("logged in");
        window.location.href = "user.html";
}
      })
      .catch(err => console.error(err));
    }
  };
}

if (window.location.pathname.endsWith("user.html")) {
  const userId = localStorage.getItem("id");
  const isLogged = localStorage.getItem("logged") === "849HD88hd8H980jG98";
  if (isLogged && userId && userId !== "null") {
    const url = "https://sohyp.pythonanywhere.com/login_user/get/" + userId;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("user_name", data.name)
        if ( data.name) {
          document.body.innerHTML = `
        <header class="header flex-col">
          <div class="header-container flex-col">
            <h2 class="main-title">أثر</h2>
            <span class="page-title">أنت</span>
          </div>
        </header>
        <div class="container flex-col">
          <div class="img flex-col">${data.name.split("")[0]}</div>
          <h3 class="user_page_user_name">${data.name} <a href="edit.html"> <i class="fa-solid fa-pen"></i></a></h3>
        </div>
        <nav class="menu">
            <h3 class="quran"><a href="quran.html">قرآن</a></h3>
            <hr>
            <h3 class="aqieda"><a href="tafsier.html">تفسير</a></h3>
            <hr>
            <h3 class="tafsieer"><a href="ahadieth.html">أحاديث</a></h3>
            <hr>
            <h3 class="hadieth"><a href="aaqieda.html">عقيدة</a></h3>
        </nav>
        <footer class="footer flex-row">
                <a href="user.html" link><i class="fa-solid fa-user"></i></a>
                <a href="community.html" link><i class="fa-solid fa-users"></i></a>
                <i class="fa-solid fa-bars"></i>
                <a href="index.html" link><i class="fa-solid fa-house"></i></a>  
        </footer>
        <script src="script.js"></script>
          `;}
        }) 
      .catch(err => console.error(err));
  } else {
    window.location.href = "login.html";
  }
}


if (window.location.pathname.endsWith("edit.html")) {
  const nameInput = document.querySelector(".user_name_input");
  const idInput = document.querySelector(".user_id_input");
  const updateBtn = document.querySelector(".update-login-data");
  const savedId = localStorage.getItem("id");
  const savedName = localStorage.getItem("user_name");

  if (!savedId || savedId === "null" || !savedName) {
    window.location.href = "login.html";
  } else {
    nameInput.value = savedName;
    idInput.value = savedId;
    idInput.readOnly = true;

    updateBtn.onclick = () => {
      const newName = nameInput.value.trim();
      const userId = parseInt(savedId);

      if (!newName) {
        alert("اكتب اسم صحيح");
        return;
      }

      if (isNaN(userId)) {
        alert("الـ ID غير صالح");
        return;
      }

      fetch("https://sohyp.pythonanywhere.com/login_user/update", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          user_name: newName,
          user_id: userId
        })
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => Promise.reject(err));
        }
        return res.json();
      })
      .then(data => {
        if (data.error) {
          alert("خطأ: " + data.error);
          return;
        }
        localStorage.setItem("user_name", newName);
        window.location.href = "user.html";
      })
      .catch(err => {
        console.error("Error:", err);
        alert("حصلت مشكلة: " + (err.error || err.message || "unknown"));
      });
    };
  }
}


if ( uploadButton && postInput ) {
  uploadButton.onclick = () => {
    if ( postInput.value ) {
      fetch("https://sohyp.pythonanywhere.com/posts/add",{
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          poster_name: localStorage.getItem("user_name"),
          posts: postInput.value
        })
      })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error("Error" + err))
      postInput.value = ""
    }
  }
    postInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      fetch("https://sohyp.pythonanywhere.com/posts/add",{
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          poster_name: localStorage.getItem("user_name"),
          posts: postInput.value
        })
      })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error("Error" + err))
      postInput.value = ""
    }
  })

}

window.addEventListener("load", () => {
  if (window.location.pathname.endsWith("community.html") ) {
    fetch("https://sohyp.pythonanywhere.com/posts/get")
    .then(res => res.json())
    .then(data => data.forEach(el => {
      document.querySelector(".scroll-container").innerHTML += `
      <div class="posts-container">
      <span class="poster-name">${el.poster_name}</span>
      <hr style="width: 100%;color: var(--main-text)" />
      <p class="post-content">${el.post}</p>
      </div>
      `
    }))
    .catch(err => console.error("Error" + err))
  }
})

if (window.location.pathname.endsWith("quran.html")) {
  let quranCont = document.getElementById("quran")
  fetch('https://api.alquran.cloud/v1/surah')
  .then(res => res.json())
  .then(data => {
    let surahs = data.data; 
    console.log(surahs)
    surahs.forEach(surah => {
      quranCont.innerHTML += `
      <div class="surah-name" onclick="goSurah(${parseInt(surah.number)})">
        <span class="go-surah" >${surah.name}</span>
      <div>
      `
    })
  })
  .catch(err => console.error("Error fetching surahs:", err));
}

function goSurah(surahNum) {
  fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`)
        .then(res => res.json())
        .then(json => {
          let selectedSurah = json.data;
          console.log(selectedSurah.ayahs);
          document.getElementById("quran").innerHTML = `
          <a href = "quran.html" class="back">ارجع</a>
        <div class="ayah-container"></div>
          `
          document.querySelector(".ayah-container").innerHTML = `
          ${selectedSurah.ayahs.map(
            (ayah) => {
              const cleanText = ayah.text.replace(/\u06E2/g, '');
              return `
                <p>${cleanText}
                <span class="flex-col">${ayah.numberInSurah}</span></p>
            `;
            }
          )
          .join('')}
          `
        })
        .catch(err => alert(err));
}
if (window.location.pathname.endsWith("tafsier.html")) {
  const searchBtn = document.querySelector(".serarc-now")
  const keywordInput = document.querySelector(".surah-num")

  searchBtn.onclick = () => {
    if (keywordInput.value) {
      search_tafsir(keywordInput.value)
      keywordInput.value = ""
    }
  }

  keywordInput.onkeypress = (e) => {
    if (e.key === "Enter" && keywordInput.value) {
      search_tafsir(keywordInput.value)
      keywordInput.value = ""
    }
  }

  function search_tafsir(keyword) {
    fetch(`https://api.alquran.cloud/v1/search/${keyword}/all/quran-uthmani`)
    .then(res => res.json())
    .then(data => {
      const matches = data.data.matches
      if (matches.length === 0) {
        document.getElementById("tafsier").innerHTML = "مفيش نتائج"
        return
      }
      const first = matches[0]
      fetch(`https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-muyassar/${first.surah.number}/${first.numberInSurah}.json`)
      .then(res => res.json())
      .then(tafsirData => {
        document.getElementById("tafsier").innerHTML = `
        <strong>${first.surah.name} - آية ${first.numberInSurah}</strong>
        <p>${first.text}</p>
        <hr />
        <p>التفسير: ${tafsirData.text}</p>
        `
      })
      .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
  }
}

if (window.location.pathname.endsWith("ahadieth.html")) {
  for (let i = 0; i < 60; i++) {
    fetch(`https://ummahapi.com/api/hadith/bukhari/${i}`)
    .then( res => res.json() )
    .then(data => {document.getElementById("ahadieth").innerHTML += `
    <div class="card">
    <p class="hadith">${data.data.arabic}</p>
    <strong style="color: var(--second-text);font-size: 22px;">رواه البخاري</strong>
    </div>
    `})
    .catch(err => console.error(err))
    fetch(`https://ummahapi.com/api/hadith/muslim/${i}`)
    .then( res => res.json() )
    .then(data => {document.getElementById("ahadieth").innerHTML += `
    <div class="card">
    <p class="hadith">${data.data.arabic}</p>
    <strong style="color: var(--second-text);font-size: 22px;">رواه مسلم</strong>
    </div>
    `})
    .catch(err => console.error(err))
  }
}

let clicked = false;
document.addEventListener("click", (e) => {
  if (e.target.closest(".fa-bars")) {
    const menu = document.querySelector(".menu");
    if (!clicked) {
      menu.setAttribute("style", "pointer-events: auto;opacity: 1;");
      clicked = true;
    } else {
      menu.setAttribute("style", "opacity: 0;pointer-events: none;");
      clicked = false;
    }
  }
});