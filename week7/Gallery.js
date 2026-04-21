const images = [
  {
    src: "https://picsum.photos/id/1015/600/400",
    title: "Mountain View"
  },
  {
    src: "https://picsum.photos/id/1016/600/400",
    title: "Forest Path"
  },
  {
    src: "https://picsum.photos/id/1025/600/400",
    title: "Cute Dog"
  },
  {
    src: "https://picsum.photos/id/1035/600/400",
    title: "Calm Beach"
  }
];

const imageGrid = document.getElementById("imageGrid");

images.forEach((image) => {
  const card = document.createElement("div");
  card.className = "image-card";

  card.innerHTML = `
    <img src="${image.src}" alt="${image.title}">
    <p>${image.title}</p>
  `;

  imageGrid.appendChild(card);
});