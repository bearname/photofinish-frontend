<template>
  <div>
    <div
        @click="isShowGallery=false"
        v-if="isShowGallery"
        id="lightboxOverlay"
        tabindex="-1"
        class="lightboxOverlay"
        style="width: 100vw; height: 100vh;"
    ></div>
    <!--  <div class="home-bg">-->
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="6">
          <v-toolbar-title v-if="!isLoggedUser" class="mr-6 float-left">
            <router-link :to="{ name: 'home'}">
              <span class="link  black--text">Home</span>
            </router-link>
          </v-toolbar-title>
          <v-toolbar-title v-if="isLoggedUser === false" class=" float-left">
            <router-link :to="{ name: 'login'}"><span class="link black--text">Login</span></router-link>
          </v-toolbar-title>
        </v-col>
        <v-col cols="12" sm="12" md="6" class="top_tbl_cell search ">
          <v-form id="searchForm"
                  class="search_here"
                  @submit.prevent="searchSubmit">
            <label class="search_label">
              <v-text-field
                  v-model="lastSearchQuery"
                  filled
                  clearable
                  autocomplete="off"
                  label="Participant number"
                  type="text"
              ></v-text-field>
              <select id="confidence"
                      name="confidence"
                      class="search_confidence"
                      v-model="selectedConfident"
              >
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
                <option>80</option>
                <option selected="selected">85</option>
                <option>90</option>
                <option>95</option>
                <option>100</option>
              </select>
              <v-btn
                  style="position: absolute; top: 12px;  padding: 0 16px 0 0; right: 0; min-width: inherit;"
                  type="submit"
                  text
                  @click="searchSubmit()">
                <IconSearch/>
              </v-btn>
            </label>
          </v-form>
        </v-col>
      </v-row>
      <v-row class="mb-5">
        <v-col :cols="12" v-if="Math.round(allImagesCount / limit) > 0">
          <v-btn @click="searchNext(false)">
            <IconNavigatePrev/>
          </v-btn>
          <v-btn class="disabled" @click="isShowPageSelection = !isShowPageSelection">
            {{ offset / limit + 1 }} of {{ Math.round(allImagesCount / limit) + (allImagesCount % limit > 0 ? 1 : 0) }}
          </v-btn>
          <v-btn @click="searchNext(true)">
            <IconNavigateNext/>
          </v-btn>
          <v-spacer/>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row v-if="images.length > 0">
        <v-col
            v-for="(picture, index) in images"
            :key="picture.PictureId"
            :cols="12"
            class="ma-0 mb-5 pa-1"
            xs="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
        >
          <!--          <img-->
          <!--              :src="picture.Path"-->
          <!--              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"-->
          <!--              max-height="280"-->
          <!--              max-width="280"-->
          <!--              aspect-ratio="1"-->
          <!--              class="ma-auto grey pointer lighten-2"-->
          <!--              @click="openGallery(picture, index)" alt="image"/>-->
          <v-img
              :src="picture.Path"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              max-height="280"
              max-width="280"
              aspect-ratio="1"
              class="ma-auto grey pointer lighten-2"
              @click="openGallery(picture, index)"
          >
            <template v-slot:placeholder>
              <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
              >
                <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-row>
      <v-row v-else>
        <p>Not found</p>
      </v-row>
    </v-container>

    <div
        v-if="isShowGallery"
        class="lightbox__wrapper"
    >
      <button id="lbClose"
              class="btn btn-sm lb-modal-close"
              @click="isShowGallery = false"
      >
        <div>
          <IconCloseSecond/>
        </div>
      </button>
      <div id="lightbox"
           tabindex="-1"
           class="lightbox"
      >

        <div class="lb-outerContainer">
          <div class="lb-container">
            <img id="lbImage" class="lb-image" :src=currentPath alt="">
            <!--          <div class="lb-tags"><span>#336 - 95%</span></div>-->
            <div class="lb-nav" style="pointer-events: auto;">
              <a id="lbPrev" class="lb-prev" aria-label="Previous image" @click="prevImg">
                <span class="btn lb-modal-prev"><IconNavigatePrev/></span>
              </a>
              <a id="lbNext" class="lb-next" aria-label="Next image" @click="nextImg">
                <span class="btn  lb-modal-next"><IconNavigateNext/></span>
              </a>
            </div>
            <div class="lb-loader" style="opacity: 0.837437; display: none;"><a class="lb-cancel"></a></div>
          </div>
        </div>
        <div class="lb-dataContainer" style="width: 163px;">
          <div class="lb-data">
            <div class="lb-details"><span class="lb-caption" style="display: none;"></span>
              <span id="lbNumber" class="lb-number" style="">Image {{ currentImage + 1 }} of {{ images.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <p id="alert" data-page="0"></p>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import BASE_URL from "../config";
import IconSearch from "../components/icons/IconSearch";
import IconNavigateNext from "../components/icons/IconNavigateNext";
import IconNavigatePrev from "../components/icons/IconNavigatePrev";
import IconCloseSecond from "../components/icons/IconCloseSecond";

export default {
  name: "Home",
  components: {IconCloseSecond, IconNavigatePrev, IconNavigateNext, IconSearch},
  data() {
    return {
      images: [],
      page: {limit: 20, offset: 0},
      limit: 20,
      offset: 0,
      allImagesCount: 0,
      lastSearchQuery: '',
      selectedConfident: 85,
      currentImage: -1,
      currentPath: '',
      isShowGallery: false,
      confidence: 85,
      query: '',
    }
  },
  computed: {
    isLoggedUser() {
      return this.isLogged()
    }
  },
  async mounted() {
    const page = {limit: 20, offset: 0}
    const response = await this.searchImages(BASE_URL, {
      q: '',
      confidence: this.selectedConfident,
      limit: page.limit,
      offset: page.offset,
    });
    if (!response.hasOwnProperty('Pictures')) {
      return;
    }
    // console.log('response');
    // console.log(response);
    this.images = response.Pictures;
    this.images.forEach(image => {
      image.Path = image.Path.replace("-preview", "-thumb");
      return image;
    });
    this.allImagesCount = response.CountAllItems;

    // function getListener (item) {
    //   return async function () {
    //     const totalPageHeight = document.body.scrollHeight;
    //     const scrollPoint = window.scrollY + window.innerHeight;
    //
    //     if (scrollPoint >= totalPageHeight) {
    //       alert("at the bottom")
    //       item.offset += item.limit;
    //       console.log("at the bottom");
    //       await item.searchNext();
    //     }
    //   };
    // }

    // function type(lbImageElement) {
    //   return lbImageElement.naturalWidth > lbImageElement.naturalHeight;
    // }

    // function getListener1(This) {
    //   return async (e) => {
    //     e.preventDefault();
    //     This.offset += This.limit;
    //     try {
    //       const data = await this.searchImages(BASE_URL, {
    //         q: This.lastSearchQuery,
    //         confidence: This.confidence,
    //         limit: This.limit,
    //         offset: This.offset
    //       });
    //       console.log(data);
    //     } catch (err) {
    //       this.notFoundImages(resultsElement);
    //       console.log('error', err);
    //     }
    //   };
    // }

    // function getListenerPrevious(This) {
    //   return async (e) => {
    //     // let currentPage = Number.parseInt( nextElement.getAttribute('data-page'));
    //     e.preventDefault();
    //     if (This.offset >= This.limit) {
    //       This.offset -= This.limit;
    //     }
    //     try {
    //       const data = await this.searchImages(BASE_URL, {
    //         q: This.lastSearchQuery,
    //         confidence: This.confidence,
    //         limit: This.limit,
    //         offset: This.offset
    //       });
    //       console.log(data);
    //     } catch (err) {
    //       this.notFoundImages(resultsElement);
    //       console.log('error', err);
    //     }
    //   };
    // }

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
    addImagesListener() {
      let resultsElement = document.getElementById("results");
      for (let i = 0; i <= resultsElement.childElementCount - 1; i++) {
        const child = resultsElement.children[i];
        child.addEventListener('click', () => {
          this.isShowGallery = true;
          this.openGallery(this, i, child, resultsElement)
        });
      }
    },
    prevImg() {
      if (this.currentImage < 1) {
        this.currentImage = this.images.length;
      }
      this.currentImage--;
      this.currentPath = this.images[this.currentImage].Path.replace("-thumb", "-preview");
    },
    nextImg() {
      if (this.currentImage >= this.images.length - 1) {
        this.currentImage = -1;
      }

      this.currentImage++;
      this.currentPath = this.images[this.currentImage].Path.replace("-thumb", "-preview");
    },
    openGallery(picture, i) {
      this.isShowGallery = true;
      this.currentImage = i;
      this.currentPath = picture.Path.replace("-thumb", "-preview");
    },
    async searchSubmit(e) {
      // e.preventDefault();
      this.offset = 0;
      try {
        await this.searchNext();
        // console.log(this.images);
      } catch (err) {
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
      const options = {
        q: this.lastSearchQuery,
        confidence: this.selectedConfident,
        limit: this.limit,
        offset: this.offset
      };
      const response = await this.searchImages(BASE_URL, options);
      this.images = response.Pictures;
      this.images.forEach(image => {
        image.Path = image.Path.replace("-preview", "-thumb");
        return image;
      });
      this.allImagesCount = response.CountAllItems;
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
        return await response.json();
      } catch (err) {
        console.log('error', err);
        return [];
      }
    },
  }
}
</script>

<style scoped>
body,
.home-bg,
.theme--light.v-application {
  width: 100%;
  height: 100%;
  /*background-color: #303235;*/
}

body, html {
  height: 100%;
  /*background-color: #303235;*/
}

.wrap {
  width: 98%;
  max-width: 1400px;
  margin: 0 auto
}

#header, .wrap {
  display: block
}

.top_tbl {
  display: table;
  width: 100%;
  padding-top: 50px
}

.top_tbl_cell {
  display: table-cell;
  vertical-align: top
}

.top_tbl_cell.logo {
  text-align: left;
  width: 250px
}

.top_tbl_cell.logo img {
  width: 95%;
  max-width: 250px;
  margin-top: 12px
}

.top_tbl_cell.search {
  text-align: right
}

.search_label {
  position: relative;
  width: 245px;
}

.content_thumb_box {
  width: 100%;
  display: inline-block
}

.content_thumb_box ul {
  -moz-column-count: 4;
  column-count: 4;
  -moz-column-gap: 15px;
  column-gap: 15px;
  text-align: justify
}

.content_thumb_box ul li {
  width: 100%;
  margin-bottom: 15px;
  overflow: hidden;
  position: relative;
  display: none;
  transition: opacity 20s ease-out
}

.content_thumb_box ul li.loaded {
  opacity: 1;
  -webkit-animation-name: fadeInOpacity;
  animation-name: fadeInOpacity;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  -webkit-animation-timing-function: ease-in;
  animation-timing-function: ease-in;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  display: block
}

@-webkit-keyframes fadeInOpacity {
  0% {
    opacity: 0
  }
  to {
    opacity: 1
  }
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0
  }
  to {
    opacity: 1
  }
}

.content_thumb_box ul li a, .content_thumb_box ul li a img {
  width: inherit
}

.content_thumb_box ul li a img {
  -webkit-filter: brightness(60%);
  filter: brightness(60%);
  transition: .3s;
  border-radius: 2px;
  border: 1px solid transparent;
  position: relative;
  display: block
}

.content_thumb_box ul li a img:hover {
  -webkit-filter: brightness(100%);
  filter: brightness(100%)
}

.content_thumb_box ul li a {
  display: inline-block;
  position: relative
}

.content_thumb_box ul li a.active {
  border: 1px solid #e27b3a
}

.content_thumb_box ul li a.active:after {
  content: "\F07A";
  font-family: FontAwesome;
  position: absolute;
  top: 10px;
  right: 15px;
  color: #e27b3a;
  width: 10px;
  height: 10px
}

.content_thumb_box ul li span {
  display: block;
  position: absolute;
  z-index: 25;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #3c3d3f;
  background-color: rgba(49, 50, 53, .6);
  color: #fff;
  font-size: 14px;
  text-transform: uppercase;
  padding: 15px 0;
  text-align: center
}

.content_thumb_box ul li:hover span {
  background-color: #3c3d3f;
  background-color: rgba(49, 50, 53, .8);
  color: #ff6c2b
}

.v-image:hover {
  cursor: pointer;
}

@media screen and (max-width: 2000px) {
  body {
    background: #303235 url(/images/arrow-bg.png) 0 0 no-repeat;
    background-size: 39.5% auto
  }
}

@media screen and (max-width: 1800px) {
  body {
    background: #303235 url(/images/arrow-bg.png) -15% 0 no-repeat;
    background-size: 45% auto
  }
}

@media screen and (max-width: 1550px) {
  body {
    background-image: none
  }

  .top_tbl {
    padding-top: 40px
  }

  .tagline {
    margin-bottom: 30px
  }
}

.top_tbl_cell {
  display: table-cell;
  vertical-align: top
}

.top_tbl_cell.logo {
  text-align: left;
  width: 250px
}

.top_tbl_cell.logo img {
  width: 95%;
  max-width: 250px;
  margin-top: 12px
}

.top_tbl_cell.search {
  text-align: right
}

.search_here {
  vertical-align: middle;
  position: relative;
}

.search_here form {
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, .34);
  transition: .3s
}

.search_here form:hover {
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, .74)
}

.search_input {
  width: 100%;
  vertical-align: top;
  font-size: 20px;
  color: #000;
  text-align: left;
  line-height: 55px;
  padding: 0 15px;
  border: 0;
  transition: .1s;
  background: #fff;
  background: -webkit-gradient(left top, left bottom, color-stop(0, #fff), color-stop(47%, #f6f6f6), color-stop(100%, #e1e1e1));
  background: linear-gradient(180deg, #fff 0, #f6f6f6 47%, #e1e1e1);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffffff", endColorstr="#e1e1e1", GradientType=0);
  -webkit-border-top-left-radius: 2px;
  -webkit-border-bottom-left-radius: 2px;
  -moz-border-radius-topleft: 2px;
  -moz-border-radius-bottomleft: 2px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  -webkit-border-top-right-radius: 2px;
  -webkit-border-bottom-right-radius: 2px;
  -moz-border-radius-topright: 2px;
  -moz-border-radius-bottomright: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px
}

.search_confidence {
  right: 55px;
  background: none;
  outline: none;
}

.search_confidence:hover {
  cursor: pointer;
}

.search_btn, .search_confidence {
  width: 29px;
  height: 55px;
  position: absolute;
  top: 0;
  right: 40px;
  border: 0;
  z-index: 2;
}

.search_btn {
  right: 0;
  vertical-align: top;
  color: #2f3134;
  text-align: center;
  cursor: pointer;
  -webkit-border-top-right-radius: 2px;
  -webkit-border-bottom-right-radius: 2px;
  -moz-border-radius-topright: 2px;
  -moz-border-radius-bottomright: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  background: #ff914d;
  background: -webkit-gradient(left top, left bottom, color-stop(0, #ff914d), color-stop(100%, #e07939));
  background: linear-gradient(180deg, #ff914d 0, #e07939);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ff914d", endColorstr="#e07939", GradientType=0)
}

.search_btn:hover {
  background: #ff8133;
  background: -webkit-gradient(left top, left bottom, color-stop(0, #ff8133), color-stop(100%, #dd6d27));
  background: linear-gradient(180deg, #ff8133 0, #dd6d27);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ff8133", endColorstr="#dd6d27", GradientType=0)
}

.search_btn img {
  width: 20px;
  height: auto;
  margin: 12px auto
}

.orange-text {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  --blue: #3490dc;
  --indigo: #6574cd;
  --purple: #9561e2;
  --pink: #f66d9b;
  --red: #e3342f;
  --orange: #f6993f;
  --yellow: #ffed4a;
  --green: #38c172;
  --teal: #4dc0b5;
  --cyan: #6cb2eb;
  --white: #fff;
  --gray: #6c757d;
  --gray-dark: #343a40;
  --primary: #3490dc;
  --secondary: #6c757d;
  --success: #38c172;
  --info: #6cb2eb;
  --warning: #ffed4a;
  --danger: #e3342f;
  --light: #f8f9fa;
  --dark: #343a40;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --font-family-sans-serif: "Nunito", sans-serif;
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-weight: 400;
  line-height: 1;
  -webkit-text-size-adjust: none;
  color: #b9bec7;
  text-align: center;
  font-family: Roboto;
  box-sizing: border-box;
  margin: 0;
  border: 0;
  outline: 0;
  vertical-align: baseline;
  background-color: #3b3b3d;
  font-size: 20px;
  padding: 25px;
}

.wrap {
  padding-bottom: 20px;
}

.lb-modal-prev {
  left: 20px;
  right: auto;
}

.lb-modal-next {
  left: auto;
  right: 20px;
}

.lb-prev svg,
.lb-next svg {
  position: absolute;
  top: 50%;
  background: white;
  border-radius: 50%;
}

.lb-next svg {
  right: -50px;
}

.lb-prev svg {
  left: -50px;
}

.lb-nav a.lb-prev,
.lb-nav a.lb-next {
  opacity: 1;
}

.lb-modal-next, .lb-modal-prev {
  cursor: pointer;
  display: block;
  margin-top: -20px;
  /*overflow: hidden;*/
  pointer-events: auto;
  position: absolute;
  text-indent: -9999em;
  top: 50%;
}

.lightbox .lb-image {
  max-height: 80vh;
  max-width: 80vh;
  border: none;
}

.lightbox__wrapper {
  position: fixed;
  z-index: 10000;
  width: 100vw;
  height: 100vh;
  top: 0;
}

.lb-modal-close {
  position: fixed;
  z-index: 10000;
  top: 0;
  right: 0;
  bottom: unset;
  left: unset;
  padding: 12px;
}

.lb-modal-close:hover {
  cursor: pointer;
}

@media (max-width: 1208px) {
  .lightbox, .lb-outerContainer {
    /*max-height: 80vh;*/
    /*max-width: 80vh;*/
    top: 50%;
    position: fixed;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

@media (max-width: 480px) {
  .lightbox .lb-image {
    max-height: 80vh;
    max-width: 300px;
  }
}

@media (max-width: 720px) {
  .lightbox .lb-image {
    max-height: 80vh;
    max-width: 400px;
  }

  .lb-next svg {
    right: 0;
  }

  .lb-prev svg {
    left: 0;
  }
}

@media (max-width: 768px) {
  .search_label,
  .search_here {
    width: 100%;
  }
}
</style>
