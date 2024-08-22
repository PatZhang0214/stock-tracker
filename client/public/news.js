
async function fetchUsers() {
  try {
      const response = await fetch('http://localhost:3000/api/users');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const users = await response.json();
      const userList = document.getElementById('userList');
      console.log(users)

      const D = users.data
      D.forEach(article => {
        const contain = document.getElementById("explore-section-1")
        const format = `<article id="explore-subsection-0" class="m-20">
                <a href=${article.url} target="_blank">
                    <img src="${article.image_url}" alt="${article.title}" class="object-cover max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:w-64 xl:h-64 h-auto">
                    <p class="font-bold font-mono">
                        ${article.title}
                    </p>
                </a>
            </article>`
        contain.insertAdjacentHTML("beforeend", format);
      });
  } catch (error) {
      console.error('Fetch error:', error);
  }
}

fetchUsers();