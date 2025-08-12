$(document).ready(function(){
    let screenWidth = $(window).width();
    if (screenWidth <= 513){
        $('.col-back').removeClass('col-5').addClass('col-4')

    }
})

// Initialize sample data if not exists
function initializeSampleData() {
  const existingNews = localStorage.getItem("islamicBlogNews")
  if (!existingNews) {
    const sampleNews = [
      {
        id: 1,
        title: "The Importance of Daily Prayers in Islam",
        excerpt:
          "Discover the spiritual significance and benefits of performing the five daily prayers (Salah) in Islam.",
        content:
          "Prayer (Salah) is one of the Five Pillars of Islam and represents the direct connection between a Muslim and Allah. The five daily prayers - Fajr, Dhuhr, Asr, Maghrib, and Isha - serve as spiritual anchors throughout the day.\n\nEach prayer has its own significance and timing. Fajr prayer, performed before dawn, helps start the day with remembrance of Allah. The midday Dhuhr prayer provides a spiritual break during busy daily activities. Asr prayer in the afternoon serves as a reminder of our duties. Maghrib prayer at sunset expresses gratitude for the day's blessings. Finally, Isha prayer before sleep helps end the day in peace and reflection.\n\nRegular prayer brings numerous benefits: spiritual purification, increased mindfulness, stress relief, and a stronger connection with the Creator. It also fosters discipline, time management, and community bonding when performed in congregation.\n\nThe Prophet Muhammad (peace be upon him) said: 'The first thing about which people will be questioned on the Day of Judgment is prayer.' This emphasizes the paramount importance of maintaining regular prayers in a Muslim's life.",
        author: "Sheikh Ahmad Hassan",
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
      },
      {
        id: 2,
        title: "Ramadan: A Month of Spiritual Reflection",
        excerpt: "Explore the deeper meanings and spiritual benefits of fasting during the holy month of Ramadan.",
        content:
          "Ramadan, the ninth month of the Islamic lunar calendar, is a time of spiritual reflection, self-improvement, and heightened devotion and worship. Muslims observe this holy month by fasting from dawn to sunset, abstaining from food, drink, and other physical needs during daylight hours.\n\nThe practice of fasting (Sawm) during Ramadan serves multiple purposes. Physically, it teaches self-discipline and self-control. Spiritually, it purifies the soul and brings one closer to Allah. Socially, it increases empathy for those less fortunate and strengthens community bonds.\n\nBeyond fasting, Ramadan is a time for increased prayer, reading the Quran, giving charity (Zakat), and seeking forgiveness. Many Muslims spend additional time in the mosque for Tarawih prayers and engage in night-long worship during Laylat al-Qadr (Night of Power).\n\nThe month concludes with Eid al-Fitr, a joyous celebration that brings families and communities together. Ramadan teaches us patience, gratitude, and the importance of spiritual over material needs.",
        author: "Dr. Fatima Al-Zahra",
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
        timestamp: Date.now() - 86400000,
      },
      {
        id: 3,
        title: "The Beautiful Names of Allah (Asma ul-Husna)",
        excerpt: "Learn about the 99 beautiful names of Allah and their profound meanings in Islamic theology.",
        content:
          "The 99 Beautiful Names of Allah, known as Asma ul-Husna, represent the various attributes and qualities of the Almighty. Each name reflects a different aspect of Allah's infinite nature and serves as a means for Muslims to understand and connect with their Creator.\n\nSome of the most commonly recited names include:\n\nAr-Rahman (The Most Merciful) - emphasizing Allah's boundless mercy\nAr-Rahim (The Most Compassionate) - highlighting His loving kindness\nAl-Malik (The King) - denoting His absolute sovereignty\nAs-Sabur (The Patient) - showing His infinite patience with His creation\nAl-Ghafur (The Forgiving) - emphasizing His readiness to forgive\n\nReciting and contemplating these names brings numerous spiritual benefits. It increases faith (Iman), provides comfort during difficult times, and helps develop a deeper understanding of Allah's nature. Many Muslims incorporate these names into their daily dhikr (remembrance) and use them in supplications.\n\nThe Prophet Muhammad (peace be upon him) said: 'Allah has ninety-nine names, and whoever learns them will go to Paradise.' This encourages Muslims to not just memorize but truly understand and embody the qualities these names represent.",
        author: "Imam Abdullah Rahman",
        date: new Date(Date.now() - 172800000).toLocaleDateString(),
        timestamp: Date.now() - 172800000,
      },
    ]
    localStorage.setItem("islamicBlogNews", JSON.stringify(sampleNews))
  }
}

// Load and display news articles
function loadNews() {
  const newsContainer = document.getElementById("news-container")
  const noNewsDiv = document.getElementById("no-news")
  const newsData = JSON.parse(localStorage.getItem("islamicBlogNews") || "[]")

  if (newsData.length === 0) {
    newsContainer.style.display = "none"
    noNewsDiv.style.display = "block"
    return
  }

  newsContainer.style.display = "grid"
  noNewsDiv.style.display = "none"

  // Sort news by timestamp (newest first)
  newsData.sort((a, b) => b.timestamp - a.timestamp)

  newsContainer.innerHTML = newsData
    .map(
      (article) => `
        <div class="news-item" onclick="readArticle(${article.id})">
            <h3>${article.title}</h3>
            <p>${article.excerpt}</p>
            <div class="news-meta">
                <span>By ${article.author}</span>
                <span>${article.date}</span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Navigate to article page
function readArticle(id) {
  window.location.href = `article.html?id=${id}`
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  initializeSampleData()
  loadNews()
})

