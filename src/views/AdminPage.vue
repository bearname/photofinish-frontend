<template>
  <div>
    <v-container>
      <v-row v-if="isShowGallery">
        <button @click="closeGallery" class="btn btn-outline-danger btn-sm lb-modal-close">
          <IconClose/>
        </button>
        <div tabindex="-1" class="lightbox" style="top: 10px; left: 0; ">
          <div class="lb-outerContainer">
            <div class="lb-container">
              <img class="lb-image" :src="picturePath" alt="">
              <div class="lb-nav" style="pointer-events: auto;">
                <a class="lb-prev" @click="prevImage" aria-label="Previous image">
                  <span class="btn lb-modal-prev"><IconNavigatePrev/></span>
                </a>
                <a class="lb-next" @click="nextImage" aria-label="Next image">
                  <span class="btn  lb-modal-next"><IconNavigateNext/>></span>
                </a>
              </div>
              <div class="lb-loader" style="opacity: 0.837437; display: none;"><a class="lb-cancel"></a></div>
            </div>
          </div>
          <div class="lb-dataContainer" style="width: 163px;">
            <div class="lb-data">
              <div class="lb-details">
                <span class="lb-caption" style="display: none;"></span>
                <span class="lb-number">Image {{ currentImage + 1 }} of {{ images.length }}</span>
              </div>
            </div>
          </div>
        </div>
        <div
            @click="isShowGallery = false"
            tabindex="-1"
            class="lightboxOverlay"
            style="width: 100vw; height: 9167vh;"></div>
      </v-row>
    </v-container>
    <v-container>
      <v-row class="mb-10">
        <v-btn class="btn" v-on:click="openNewEventPopup">Create event</v-btn>
        <v-btn class="btn" v-on:click="openNewImagePopup">Add images</v-btn>
        <v-btn
            depressed
            color="error"
            v-if="picturesToDelete.length > 0"
            class="btn"
            @click="onDeleteEvent(-1, 'picture')">
          Delete selected images
        </v-btn>
      </v-row>
      <v-row v-if="picturesToDelete.length >0">
        <div>Selected images:</div>
        <div v-if="picturesToDelete.length > 0">
          <div v-for="image in picturesToDelete">
            {{ image }}
          </div>
        </div>
      </v-row>
      <v-row v-if="events !== null">
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                Location
              </th>
              <th class="text-left">
                Action
              </th>
              <!--              <th class="text-left">-->
              <!--                Action-->
              <!--              </th>-->
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in events"
                :key="item.Id"
            >
              <td>{{ item.Name }}</td>
              <td>{{ item.Location }}</td>
              <td>
                <button class="btn" v-on:click="onDeleteEvent(item.Id)">
                  <IconDelete/>
                </button>
                <button class="btn" @click="searchEventImage(item.Id)">
                  <IconSearch/>
                </button>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <div class="text-center">
          <v-dialog v-model="approveToDeleteEventPermanent" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDeleteEvent">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="approvedDeleteEvent">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-row>
      <v-row>
        <div class="text-center">
          <v-dialog
              v-model="newEventPopup"
              width="500"
          >
            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                New events
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-text-field
                    autofocus
                    label="Name"
                    v-model="eventName"
                    :rules="rules"
                    hide-details="auto"
                    color="grey darken-3"
                ></v-text-field>
              </v-card-text>
              <v-card-text>
                <v-text-field
                    v-model="eventLocation"
                    :rules="rules"
                    label="Location"
                    color="grey darken-3"
                ></v-text-field>
              </v-card-text>
              <v-card-text>
                <v-date-picker
                    v-model="eventDate"
                    color="grey darken-2"
                    class="mt-4"
                    min="1980-06-15"
                    max="2100-03-20"
                ></v-date-picker>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text
                    @click="newEventPopup = false"
                >
                  <IconClose/>
                </v-btn>
                <v-btn class="btn"
                       text
                       @click="submitNewEvent">Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <div class="text-center">
          <v-dialog
              v-model="newImageToProcessingPopup"
              width="500"
          >
            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                New photos
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-text-field
                    autofocus
                    label="dropbox folder path"
                    v-model="dropboxPath"
                    :rules="path"
                    hint="/images"
                    hide-details="auto"
                    color="grey darken-3"
                ></v-text-field>
              </v-card-text>
              <v-card-text>
                <v-select
                    v-model="eventId"
                    :items="options"
                    label="event"
                    color="grey darken-3"
                    @input="setEventId(eventId)"
                />
                <td>{{ eventId }}</td>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text
                    @click="newImageToProcessingPopup = false"
                >
                  <IconClose/>
                </v-btn>
                <v-btn
                    class="btn"
                    text
                    @click="submitNewImages"
                >
                  Send
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-row>
    </v-container>
    <v-container v-if="isShow">
      <v-row v-if="images.length > 0">
        <v-col :cols="12" v-if="countPages > 0">
          <v-select
              :items="pages"
              label="Rows per page"
              v-model="limit"
          ></v-select>
          <v-text-field
              type="number"
              label="Confidence"
              v-model="confidence"
              :min="0"
              :max="100"
          ></v-text-field>
          <v-btn @click="searchEventImage(eventId)">
            <IconSearch/>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="images.length > 0">
        <v-col class="ma-auto" :cols="12" v-if="countPages > 0">
          <v-btn @click="previousPage">
            <IconNavigatePrev/>
          </v-btn>
          <v-btn class="disabled" @click="isShowPageSelection = !isShowPageSelection">
            {{ imagePage + 1 }} of {{ countPages }}
          </v-btn>
          <v-btn @click="nextPage">
            <IconNavigateNext/>
          </v-btn>
          <div v-if="isShowPageSelection" class="mt-4">
            <v-form @submit.prevent="goToPage">
              <v-text-field
                  autofocus
                  class="shrink mx-4"
                  v-model="selectedPage"
                  :min="1"
                  :max="countPages"
                  filled
                  rounded
                  dense
                  single-line
                  placeholder="Page"
                  append-icon="mdi-magnify"
                  type="number"
              />
              <v-btn type="submit" class="disabled" @click="goToPage">
                Go To Page
              </v-btn>
            </v-form>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="images.length > 0">
        <v-col
            v-for="(picture, index) in images"
            :key="picture.PictureId"
            :cols="12"
            class="ma-0 mb-5 pa-0"
            xs="12"
            sm="6"
            md="4"
            lg="3"
        >
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
          <v-card-actions class="card-actions">
            <v-btn @click="onDeleteEvent(picture.PictureId, 'picture')">
              <IconDelete/>
            </v-btn>
            <v-btn>
              <label for="jack">Add To Delete
                <input type="checkbox" id="jack" :value=picture.PictureId v-model="picturesToDelete">
              </label>
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
      <v-row v-else>
        <p>Not found</p>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {publishEvent} from "@/events/event-bus";
import axios from 'axios';
import BASE_URL from "@/config";
import IconSearch from "@/components/icons/IconSearch";
import IconDelete from "@/components/icons/IconDelete";
import IconNavigatePrev from "@/components/icons/IconNavigatePrev";
import IconNavigateNext from "@/components/icons/IconNavigateNext";
import IconClose from "@/components/icons/IconClose";

export default {
  name: "Playlist",
  components: {IconClose, IconNavigateNext, IconNavigatePrev, IconDelete, IconSearch},
  data() {
    return {
      events: null,
      picturesToDelete: [],
      images: null,
      isShow: false,
      imagePage: 0,
      selectedPage: 1,
      pages: [10, 15, 20, 40],
      isShowPageSelection: false,
      limit: 20,
      confidence: 0,
      countPages: null,
      status: null,
      approveToDeleteEventPermanent: false,
      newImageToProcessingPopup: false,
      isShowGallery: false,
      newEventPopup: false,
      deleteEventId: null,
      action: null,
      eventId: null,
      eventName: null,
      eventDate: null,
      eventLocation: null,
      dropboxPath: "/",
      picturePath: '',
      currentImage: -1,
      rules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 3 characters',
      ],
      path: [
        value => !!value || 'Required.',
        value => (value && value.length >= 2 && value[0] === '/') || 'Min 2 characters',
      ]
    }
  },
  async created() {
    await this.fetchEvents();
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      const code = e.code;
      console.log(` ${code}`);
      if (this.isShowGallery) {
        if (code === 'ArrowRight') {
          this.nextImage(e);
        } else if (code === 'ArrowLeft') {
          this.prevImage(e);
        } else if (code === 'Escape') {
          this.isShowGallery = false;
        }
      } else {
        if (code === 'KeyS' && !this.newImageToProcessingPopup && !this.newEventPopup) {
          this.newImageToProcessingPopup = true;
        } else if (code === 'KeyE' && !this.newEventPopup && !this.newImageToProcessingPopup) {
          this.newEventPopup = true;
        }
      }
      if (this.isShow && !this.isShowGallery && !this.newEventPopup && !this.newImageToProcessingPopup) {
        if (code === 'ArrowRight') {
          this.nextPage();
        } else if (code === 'ArrowLeft') {
          this.previousPage();
        } else if (code === 'KeyP') {
          this.isShowPageSelection = !this.isShowPageSelection;
        }
      }
    });
  },
  computed: {
    options() {
      if (this.events !== null) {
        const data = [];
        this.events.forEach(item => {
          data.push(item.Id + ' ' + item.Name);
        });
        return data;
      }
      return [];
    },
  },
  methods: {
    ...mapActions({
      findEvents: "eventsMod/findEvents",
      createNewEvent: "eventsMod/createEvent",
      newImagesToRekognition: "eventsMod/newImages",
      deleteEvent: "eventsMod/deleteEventPermanent",
      deletePicture: "eventsMod/deleteImagePermanent",
    }),
    ...mapGetters({
      getStatus: "eventsMod/getStatus",
      getMessage: "eventsMod/getMessage",
      getEvents: "eventsMod/getEvents",
    }),
    async fetchEvents() {
      // console.log("data");
      // console.log(events);
      this.events = await this.findEvents();
    },
    async goToPage() {
      if (this.isShowPageSelection) {
        if (this.selectedPage < 1 || this.selectedPage > this.countPages) {
          publishEvent(false, `Valid page range [1, ${this.countPages}]`);
          return;
        }
        // console.log("this.selectedPage");
        // console.log(this.selectedPage);
        await this.searchEventImages(this.eventId, Number.parseInt(this.selectedPage) - 1);
        this.isShowPageSelection = false;
      } else {
        this.isShowPageSelection = true;
      }
    },
    onDeleteEvent(eventId, action = 'event') {
      // console.log("eventId");
      // console.log(eventId);
      this.deleteEventId = eventId;
      this.action = action;
      this.approveToDeleteEventPermanent = true;
    },
    closeDeleteEvent() {
      this.approveToDeleteEventPermanent = false;
    },
    async approvedDeleteEvent() {
      const action = this.action;
      // console.log("eventId");
      this.approveToDeleteEventPermanent = false;
      const itemId = this.deleteEventId;
      // console.log(itemId);

      if (action === 'event') {
        await this.deleteEvent({eventId: itemId});

      } else if (action === 'picture') {
        if (itemId !== -1) {
          this.picturesToDelete = [itemId]
        }
        // console.log(JSON.stringify(this.picturesToDelete));
        await this.deletePicture({pictures: this.picturesToDelete});
      }

      const success = this.getStatus() === 1;
      if (success) {
        let i = 0
        const data = []
        if (action === 'event') {
          for (; i < this.events.length; i++) {
            const event = this.events[i];
            if (event.Id !== itemId) {
              data.push(event);
            }
          }
          this.events = data;
        } else if (action === 'picture') {
          if (itemId !== -1) {
            for (; i < this.images.length; i++) {
              const event = this.images[i];
              if (event.PictureId !== itemId) {
                data.push(event);
              }
            }
          } else {
            for (const image of this.images) {
              for (const itemId of this.picturesToDelete) {
                if (image.PictureId !== itemId) {
                  data.push(image);
                }
              }
            }
          }

          this.picturesToDelete = []
          this.images = data;
        }
      }
      this.deleteEventId = null;
      publishEvent(success, this.getMessage());
    },
    openNewEventPopup() {
      this.newEventPopup = true;
    },
    openGallery(picture, index) {
      this.isShowGallery = true;
      this.picturePath = picture.Path.replace("-thumb", "-preview");
      this.currentImage = index;
    },
    closeGallery() {
      this.isShowGallery = false;
    },
    nextImage(e) {
      e.preventDefault();
      if (this.currentImage >= this.images.length - 1) {
        this.currentImage = -1;
      }
      this.currentImage++;
      // console.log(this.currentImage);
      // console.log(path);
      this.picturePath = this.images[this.currentImage].Path.replace("-thumb", "-preview");
    },
    prevImage(e) {
      e.preventDefault();
      if (this.currentImage <= 0) {
        this.currentImage = this.images.length;
      }
      this.currentImage--;
      this.picturePath = this.images[this.currentImage].Path.replace("-thumb", "-preview");
    },
    async submitNewEvent() {
      this.newEventPopup = false;

      if (this.eventName === null || this.eventLocation === null || this.eventDate === null) {
        publishEvent(success, "invalid event name or event location");
        return
      }

      const b = !this.rules[1](this.eventName);
      const b1 = this.eventLocation !== null && !this.rules[1](this.eventLocation);
      if (b || b1) {
        publishEvent(success, "invalid event name or event location");
        return
      }
      // console.log(this.eventName);
      // console.log(this.eventDate);
      // console.log(this.eventLocation);
      await this.createNewEvent({name: this.eventName, location: this.eventLocation, date: this.eventDate});
      const success = this.getStatus();
      const message = this.getMessage();
      if (success) {
        this.events.push({
          Id: Number.parseInt(message.substring(message.lastIndexOf(' '))),
          Name: this.eventName,
          Date: this.eventDate,
          Location: this.eventLocation,
        });
      }
      publishEvent(success, message);
    },
    openNewImagePopup() {
      this.newImageToProcessingPopup = true;
    },
    async submitNewImages() {
      if (this.dropboxPath === null || this.eventId === null) {
        publishEvent(false, "Invalid ");
        return
      }
      if (!this.path[1](this.dropboxPath)) {
        publishEvent(false, "invalid event name or event location");
        return
      }

      try {
        await this.newImagesToRekognition({
          path: this.dropboxPath,
          eventId: this.eventId
        });
        this.newImageToProcessingPopup = false;
        const status = this.getStatus();
        publishEvent(status, status ? "Sent for processing" : this.getMessage());
      } catch (e) {
        console.log(e);
        publishEvent(false, e);
      }
    },
    setEventId(item) {
      console.log(item);
      this.eventId = Number.parseInt(item.substring(0, item.indexOf(' ')));
    },
    async searchEventImage(eventId) {
      await this.searchEventImages(eventId);
    },
    async searchEventImages(eventId, page = 0) {
      this.isShow = true;
      this.eventId = eventId;
      this.imagePage = page;
      console.log("this.limit")
      console.log(this.limit)
      const response = await axios.get(`${BASE_URL}/api/v1/picture/search?eventId=${eventId}&offset=${this.imagePage * this.limit}&limit=${this.limit}&confidence=${this.confidence}`);
      const data = response.data;
      const countPages = Math.ceil(data.CountAllItems / this.limit);
      console.log(countPages);
      this.countPages = countPages;
      this.images = data.Pictures;
      this.images.forEach(image => {
        image.Path = image.Path.replace("-preview", "-thumb");
        return image;
      });

      console.log(this.images);
    },
    async previousPage() {
      console.log(this.imagePage)
      if (this.imagePage > 0) {
        this.imagePage--;
        await this.searchEventImages(this.eventId, this.imagePage);
      }
    },
    async nextPage() {
      console.log(this.imagePage)
      if (this.imagePage < this.countPages - 1) {
        this.imagePage++;
        await this.searchEventImages(this.eventId, this.imagePage);
      }
    },
  },
}
</script>

<style scoped>
body {
  min-width: 320px;
}

.card {
  overflow: hidden;
  position: relative;
}

.card:hover .card-actions {
  visibility: visible;
  opacity: 1;
  display: block;
  background-color: #62646f;
}

.card-actions {
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: 0;
  display: none;
  visibility: hidden;
  transition: 0.3s;
}

.lb-modal-prev {
  left: 20px;
  right: auto;
}

.lb-modal-next {
  left: auto;
  right: 20px;
}

.lb-modal-next, .lb-modal-prev {
  cursor: pointer;
  display: block;
  margin-top: -20px;
  overflow: hidden;
  pointer-events: auto;
  position: absolute;
  text-indent: -9999em;
  top: 50%;
}


.lightbox .lb-image {
  max-height: 80vh;
  max-width: 450px;
}

@media (max-width: 1208px) {
  .lightbox, .lb-outerContainer {
    /*max-height: 80vh;*/
    /*max-width: 80vh;*/
  }
}

@media (max-width: 720px) {
  .lightbox .lb-image {
    max-height: 80vh;
    max-width: 450px;
  }
}

@media (max-width: 480px) {
  .lightbox .lb-image {
    max-height: 80vh;
    max-width: 280px;
  }
}
</style>
