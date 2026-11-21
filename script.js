// Data profil contoh. Setiap profil memiliki himpunan minat.
const profiles = [
  { id: 1, name: "Andi Pratama", initial: "AP", major: "Sistem Informasi", bio: "Suka game strategi dan membuat project web.", interests: ["Gaming", "Coding", "Belajar"], color: "#7660df" },
  { id: 2, name: "Budi Santoso", initial: "BS", major: "Teknik Informatika", bio: "Mencari teman mabar dan belajar pemrograman.", interests: ["Gaming", "Coding", "Musik"], color: "#e58c67" },
  { id: 3, name: "Citra Amelia", initial: "CA", major: "Sistem Informasi", bio: "Senang desain UI dan belajar bersama.", interests: ["Desain", "Coding", "Belajar"], color: "#43ae91" },
  { id: 4, name: "Dika Ramadhan", initial: "DR", major: "Pendidikan Jasmani", bio: "Aktif futsal dan sesekali bermain game.", interests: ["Futsal", "Gaming"], color: "#4c9bd5" },
  { id: 5, name: "Eka Putri", initial: "EP", major: "Manajemen", bio: "Suka musik, desain, dan diskusi kelompok.", interests: ["Musik", "Desain", "Belajar"], color: "#d77fa8" },
  { id: 6, name: "Fajar Maulana", initial: "FM", major: "Sistem Informasi", bio: "Mencari partner coding dan kelompok belajar.", interests: ["Coding", "Belajar", "Gaming"], color: "#d2a23f" }
];

// Operasi himpunan: irisan, gabungan, dan selisih.
const intersection = (A, B) => A.filter(x => B.includes(x));
const union = (A, B) => [...new Set([...A, ...B])];
const difference = (A, B) => A.filter(x => !B.includes(x));

const choices = document.querySelector("#choices");
const grid = document.querySelector("#profiles");
let matches = [];

function selected() {
  return [...choices.querySelectorAll("input:checked")].map(x => x.value);
}

function render() {
  const A = selected();
  const mode = document.querySelector("#mode").value;

  matches = profiles
    .map(p => ({
      ...p,
      common: intersection(A, p.interests),
      all: union(A, p.interests),
      mine: difference(A, p.interests),
      theirs: difference(p.interests, A)
    }))
    .filter(p => !A.length || (mode === "intersection" ? p.common.length > 0 : mode === "union" ? p.all.length > 0 : p.theirs.length > 0))
    .sort((a, b) => b.common.length - a.common.length || a.name.localeCompare(b.name));

  document.querySelector("#count").textContent = matches.length;
  document.querySelector("#empty").hidden = matches.length > 0;
  grid.innerHTML = "";

  matches.forEach(p => {
    const tags = mode === "difference" ? p.theirs : mode === "union" ? p.all : p.common;
    const card = document.createElement("article");
    card.className = "profile";
    card.innerHTML = `
      <div class="profile-top">
        <div class="avatar" style="background:${p.color}">${p.initial}</div>
        <div>
          <h4>${p.name}</h4>
          <small>${p.major}</small>
        </div>
        <span class="score">${p.common.length} cocok</span>
      </div>
      <p class="bio">${p.bio}</p>
      <div class="tags">
        ${tags.map(t => `<span class="tag">${t}</span>`).join("") || '<span class="tag">Tidak ada minat tambahan</span>'}
      </div>
      <div class="profile-foot">
        <small>${p.interests.length} minat</small>
        <button class="connect" data-name="${p.name}">Sapa teman</button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelector("#caption").textContent = 
    mode === "intersection" ? "Profil dengan minat yang sama ditampilkan." : 
    mode === "union" ? "Gabungan minat kamu dan setiap profil." : 
    "Minat yang dimiliki profil tetapi belum kamu pilih.";

  const p = matches[0];
  const calc = document.querySelector("#calc");

  if (!p) {
    calc.textContent = "Tidak ada profil untuk dihitung. Pilih minat lain.";
    return;
  }

  calc.innerHTML = `
    <b>A (Minat kamu)</b> = { ${A.join(", ") || "∅"} }<br>
    <b>B (${p.name})</b> = { ${p.interests.join(", ")} }<br>
    <b>A ∩ B</b> = { ${p.common.join(", ") || "∅"} }<br>
    <b>A ∪ B</b> = { ${p.all.join(", ")} }<br>
    <b>A − B</b> = { ${p.mine.join(", ") || "∅"} }<br>
    <b>B − A</b> = { ${p.theirs.join(", ") || "∅"} }
  `;
}

document.querySelector("#find").addEventListener("click", render);
document.querySelector("#mode").addEventListener("change", render);
choices.addEventListener("change", render);

document.querySelector("#reset").addEventListener("click", () => {
  choices.querySelectorAll("input").forEach(x => x.checked = false);
  render();
});

grid.addEventListener("click", e => {
  const b = e.target.closest(".connect");
  if (!b) return;
  const t = document.querySelector("#toast");
  t.textContent = `Permintaan menyapa ${b.dataset.name} berhasil disimulasikan!`;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
});

render();