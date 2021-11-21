<template>
  <div>
    <!--    <Pagination :show-status="false" :user-page="false"/>-->
    <div id="wrap">
      <div class="wrap">
        <div class="top_tbl">
          <a href="/" class="top_tbl_cell logo"><img src="images/logo.png" alt=""></a>
          <div class="top_tbl_cell search">
            <form id="searchForm" class="search_here" @submit.prevent="searchSubmit">
              <!--              <label>-->
              <input id="searchInput" type="text" placeholder="Search by photos" autofocus="autofocus"
                     maxlength="50" class="search_input">
              <!--            </label>-->
              <label>
                <select id="confidence" name="confidence"
                        class="search_confidence">
                  <option>0</option>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                  <option>25</option>
                  <option>30</option>
                  <option>35</option>
                  <option>40</option>
                  <option>45</option>
                  <option>50</option>
                  <option>55</option>
                  <option>60</option>
                  <option>65</option>
                  <option>70</option>
                  <option>75</option>
                  <option selected="selected">85</option>
                  <option>90</option>
                  <option>95</option>
                  <option>100</option>
                </select>
              </label>
              <button type="submit" class="search_btn" v-on:submit="searchSubmit()"><img src="images/icon-search.png"
                                                                                         alt=""></button>
            </form>
          </div>
        </div>
        <div v-if="isLoggedUser === false">
          <router-link :to="{ name: 'login'}">login</router-link>
        </div>
        <!--        <div data-v-173e40e2="" class="tagline"><a data-v-173e40e2="" href="/upload.html" class="active">-->
        <!--          Upload-->
        <!--        </a></div>-->
      </div>
    </div>
    <div class="content_thumb_box">
      <div class="wrap">
        <ul id="results"></ul>
      </div>
    </div>
    <div id="lightbox" tabindex="-1" class="lightbox" style="top: 550px; left: 0px; display: none;">
      <div class="lb-outerContainer" style="width: 163px; height: 215px;">
        <div class="lb-container"><img class="lb-image"
                                       src="https://kotortri.s3.us-east-2.amazonaws.com/a96c0fb7898518f0963e08cfc800c937.jpg?id=655"
                                       alt="" style="width: 163px; height: 215px;">
          <div class="lb-tags"><span>#336 - 95%</span></div>
          <div class="lb-nav" style="pointer-events: auto;"><a class="lb-prev" aria-label="Previous image" href=""
                                                               style=""></a><a class="lb-next" aria-label="Next image"
                                                                               href="" style=""></a></div>
          <div class="lb-loader" style="opacity: 0.837437; display: none;"><a class="lb-cancel"></a></div>
        </div>
      </div>
      <div class="lb-dataContainer" style="width: 163px;">
        <div class="lb-data">
          <div class="lb-details"><span class="lb-caption" style="display: none;"></span><span class="lb-number"
                                                                                               style="">Image 22 of 22</span>
          </div>
          <div class="lb-closeContainer"><a class="lb-close"></a></div>
        </div>
        <a class="btn_add_cart" style=""><img src="images/icon-add.png" alt=""><span>Add to Cart</span></a></div>
    </div>
    <v-btn id="prev" v-on:click="searchNext(false)" data-page="0"><=</v-btn>
    <v-btn id="next" v-on:click="searchNext(true)" data-page="0">=></v-btn>
    <p id="alert" data-page="0"></p>
    <div id="lightboxOverlay" tabindex="-1" class="lightboxOverlay"
         style="display: none; width: 1903px; height: 9167px;"></div>
  </div>
</template>

<script>
// import Pagination from '../components/Pagination.vue'
// import Gallery from '../components/Gallery.vue'
import {mapActions, mapGetters} from "vuex";

// const BASE_URL = process.env.VUE_APP_BACKEND_API;

// export const BASE_URL = "http://localhost:8000";
const BASE_URL = "https://evening-atoll-24533.herokuapp.com";
export default {
  name: "Home",
  components: {
    // Gallery
    // Pagination
  },
  data() {
    return {
      images: [],
      page: {limit: 20, offset: 0},
      limit: 20,
      offset: 0,
      lastSearchQuery: '',
      selectedConfident: 85,
    }
  },
  computed: {
    isLoggedUser() {
      return this.isLogged()
    }
  },
  async mounted() {
    let resultsElement = document.getElementById("results");
    const page = {limit: 20, offset: 0}
    this.images = await this.searchImages(BASE_URL, {
      confidence: this.selectedConfident,
      limit: page.limit,
      offset: page.offset
    });
    this.drawImages(this.images, resultsElement);

    function getListener(item) {
      return async function () {
        const totalPageHeight = document.body.scrollHeight;
        const scrollPoint = window.scrollY + window.innerHeight;

        if (scrollPoint >= totalPageHeight) {
          alert("at the bottom")
          item.offset += item.limit;
          console.log("at the bottom");
          await item.searchNext();
        }
      };
    }

    let prevElement = document.getElementById("prev");
    let nextElement = document.getElementById("next");

    function getListener1(This) {
      return async (e) => {
        // let currentPage = Number.parseInt( nextElement.getAttribute('data-page'));
        e.preventDefault();
        This.offset += This.limit;
        try {
          const data = await this.searchImages(BASE_URL, {
            q: This.lastSearchQuery,
            confidence: This.confidence,
            limit: This.limit,
            offset: This.offset
          });
          this.drawImages(data, resultsElement, false);
          console.log(data);
        } catch (err) {
          this.notFoundImages(resultsElement);
          console.log('error', err);
        }
      };
    }

    function getListenerPrevious(This) {
      return async (e) => {
        // let currentPage = Number.parseInt( nextElement.getAttribute('data-page'));
        e.preventDefault();
        if (This.offset >= This.limit) {
          This.offset -= This.limit;
        }
        try {
          const data = await this.searchImages(BASE_URL, {
            q: This.lastSearchQuery,
            confidence: This.confidence,
            limit: This.limit,
            offset: This.offset
          });
          this.drawImages(data, resultsElement, false);
          console.log(data);
        } catch (err) {
          this.notFoundImages(resultsElement);
          console.log('error', err);
        }
      };
    }

    // nextElement.addEventListener('click', getListener1(this));
    // prevElement.addEventListener('click', getListenerPrevious(this));
    // window.addEventListener('scroll', getListener(this))
  },
  methods: {
    ...mapActions({
      logout: "authMod/logout",
    }),
    ...mapGetters({
      isLogged: "authMod/isLoggedIn",
      getUser: "authMod/getCurrentUser",
      getCurrentUser: "authMod/getCurrentUser",
    }),
    async searchSubmit(e) {
      e.preventDefault();
      this.offset = 0;
      let resultsElement = document.getElementById("results");
      let searchInputElement = document.getElementById("searchInput");
      let confidenceElement = document.getElementById("confidence");

      try {
        this.selectedConfident = confidenceElement.value;
        this.lastSearchQuery = searchInputElement.value;
        await this.searchNext();
        console.log(this.images);
      } catch (err) {
        resultsElement.innerHTML = 'Не найдено';
        this.notFoundImages(resultsElement);
        console.log('error', err);
      }
    },
    async searchNext(isNext = false) {
      if (isNext) {
        this.offset += this.limit;
      } else {
        if (this.offset >= this.limit) {
          this.offset -= this.limit;
        }
      }
      // alert('search next');
      const resultsElement = document.getElementById("results");
      const options = {
        q: this.lastSearchQuery,
        confidence: this.selectedConfident,
        limit: this.limit,
        offset: this.offset
      };
      this.images = await this.searchImages(BASE_URL, options);
      this.drawImages(this.images, resultsElement);
    },
    notFoundImages() {
      document.getElementById('alert').innerHTML = 'Не найдено';
    },
    async searchImages(baseUrl, options = {}) {
      try {
        let url = `${baseUrl}/api/v1/picture/search?`;
        if (options.hasOwnProperty('q')) {
          url += `number=${options.q}`;
        }
        if (options.hasOwnProperty('confidence')) {
          if (options.hasOwnProperty('q')) {
            url += `&`;
          }
          url += `confidence=${options.confidence}`;
        }
        if (options.hasOwnProperty('eventId')) {
          url += `&eventId=${options.eventId}`;
        }
        if (options.hasOwnProperty('limit')) {
          url += `&limit=${options.limit}`;
        }
        if (options.hasOwnProperty('offset')) {
          url += `&offset=${options.offset}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          return [];
        }
        return await response.json()
      } catch (err) {
        console.log('error', err);
        return [];
      }
    },
    drawImages(data, parentElement, needClear = true) {
      const pictures = data.Pictures;
      if (pictures.length === 0) {
        if (needClear) {
          parentElement.innerHTML = '';
        }
        this.notFoundImages();
      } else {
        if (needClear) {
          parentElement.innerHTML = '';
        }
        let innerHtml = '';
        for (const picture of pictures) {
          innerHtml += this.drawImage(picture, innerHtml);
        }
        if (needClear) {
          console.log('needclear')
          parentElement.innerHTML = innerHtml;
        } else {
          console.log('notneedclear')
          let element = document.createElement('div');
          element.innerHTML = innerHtml
          parentElement.appendChild(element);
        }
      }
    },
    drawImage(picture) {
      let picturePath = picture.Path;

      picturePath = (picturePath.substring(0, "https://".length) === 'https://') ? picturePath : "/images/" + picturePath;
      console.log(picturePath.substring(0, "https://".length));
      let innerHtml = `<li data-v-519eea8b="" class="loaded">
                         <a data-v-519eea8b data-lightbox="lightbox" class="">
                         <img src="${picturePath}" alt="${picture.PictureId}">
                        </a>`;
      innerHtml += `<span>`;
      for (const item of picture.TextDetections) {
        innerHtml += `#${item.DetectedText} ${item.Confidence}% `
      }

      ` </span> </li>`;
      return innerHtml;
    }

  }
}
</script>

<style scoped>

</style>