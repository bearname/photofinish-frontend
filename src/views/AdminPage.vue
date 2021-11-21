<template>
  <div>
    <v-container>
      <v-row>
        <button class="btn" v-on:click="openNewEventPopup">Создать событие</button>
        <button class="btn" v-on:click="openNewImagePopup">Добавить изображения</button>
      </v-row>
      <v-row v-if="events !== null">
        <!--      <div v-for="events in events" v-bind:key="events.Id">-->
        <!--        <div>-->
        <!--          <router-link :to="{ name: 'event', query: {Id: events.Id}}" class="subtitle-2">&ndash;&gt;-->
        <!--            <span class="subtitle-2">{{-->
        <!--                events.name-->
        <!--              }}</span>-->
        <!--          </router-link>-->
        <!--          <span> location {{ events.Location }}</span>-->
        <!--          <span> date {{ events.Date }}</span>-->
        <!--          <button class="btn" v-on:click="onDeleteEvent(events.Id)">delete</button>-->
        <!--        </div>-->
        <!--      </div>-->

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
              <th class="text-left">
                Action
              </th>
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
                <button class="btn" v-on:click="onDeleteEvent(item.Id)">Удалить событие</button>
              </td>
              <td>
                <button class="btn" v-on:click="searchEventImages(item.Id)">Найти изображения</button>
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
          <v-dialog
              v-model="approveToDeleteEventPermanent"
              width="500"
          >
            <v-card>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    text
                    @click="approvedDeleteEvent"
                >
                  Подтвердить удаление события
                </v-btn>
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
                Новые событие
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-text-field
                    label="Название"
                    v-model="eventName"
                    :rules="rules"
                    hide-details="auto"
                ></v-text-field>
              </v-card-text>
              <v-card-text>
                <v-text-field
                    v-model="eventLocation"
                    :rules="rules"
                    label="Локация"
                ></v-text-field>
              </v-card-text>
              <v-card-text>
                <v-date-picker
                    v-model="eventDate"
                    class="mt-4"
                    min="1980-06-15"
                    max="2100-03-20"
                ></v-date-picker>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    text
                    @click="submitNewEvent"
                >
                  Сохранить
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
                Новые изображения
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-text-field
                    label="Путь dropbox папки"
                    v-model="dropboxPath"
                    :rules="path"
                    hide-details="auto"
                ></v-text-field>
              </v-card-text>
              <v-card-text>
                <v-select
                    v-model="eventId"
                    :items="options"
                    label="event"
                    @input="setEventId(eventId)"
                />
                <td>{{ eventId }}</td>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    text
                    @click="submitNewImages"
                >
                  Отправить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-row>
    </v-container>
    <v-container v-if="isShow">
      <v-row v-if="images.length > 0">
        <!--      <v-row >-->
        <v-col :cols="12" v-if="countPages > 0">
          <v-btn v-on:click="previousPage"><=</v-btn>
          <v-btn class="disabled">{{ imagePage + 1 }} of {{ countPages }}</v-btn>
          <v-btn v-on:click="nextPage">=></v-btn>
        </v-col>
        <v-col
            v-for="picture in images"
            :key="picture.PictureId"
            :cols="4"
            sm="12"
            md="3"
        >
          <v-card>
            <v-img
                :src="picture.Path"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
            >
              <!--              <v-card-title v-text="card.PictureId"></v-card-title>-->
            </v-img>
            <v-card-actions>
              <v-btn v-on:click="onDeleteEvent(picture.PictureId, 'picture')">Удалить</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <!--      <v-row>-->
      <v-row v-else>
        <p>Не найдено</p>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
// import VideoList from "../components/VideoList";
// import {playlistModification} from "../store/playlistStore/actions";
import {publishEvent} from "@/events/event-bus";
import axios from 'axios';
// export const BASE_URL = process.env.VUE_APP_BACKEND_API;

// export const BASE_URL = "http://localhost:8000";
const BASE_URL = "https://evening-atoll-24533.herokuapp.com";
export default {
  name: "Playlist",
  components: {
    // VideoList,
  },
  data() {
    return {
      events: null,
      images: null,
      isShow: false,
      imagePage: null,
      limit: 20,
      countPages: null,
      status: null,
      approveToDeleteEventPermanent: false,
      newImageToProcessingPopup: false,
      newEventPopup: false,
      deleteEventId: null,
      action: null,
      eventId: null,
      eventName: null,
      eventDate: null,
      eventLocation: null,
      dropboxPath: null,
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
      // findUserLikedVideos: "userMod/getUserLikedVideos",
      findEvents: "eventsMod/findEvents",
      createNewEvent: "eventsMod/createEvent",
      newImagesToRekognition: "eventsMod/newImages",
      deleteEvent: "eventsMod/deleteEventPermanent",
      deletePicture: "eventsMod/deleteImagePermanent",
      // findPlaylist: "playlistMod/getPlaylist",
      // fetchUserPlaylists: "playlistMod/getUserPlaylists",
      // removeVideo: "playlistMod/getUserPlaylists",
      // doPlaylistModification: "playlistMod/modifyPlaylist"
    }),
    ...mapGetters({
      // getVideoResult: "userMod/getUserVideos",
      // getPlaylistsRequestResult: "playlistMod/getPlaylists",
      // getPlaylistResult: "playlistMod/getPlaylist",
      getStatus: "eventsMod/getStatus",
      getMessage: "eventsMod/getMessage",
      getEvents: "eventsMod/getEvents",
    }),
    async fetchEvents() {
      const events = await this.findEvents();
      console.log("data")
      console.log(events)
      console.log("data")
      // const result = this.getEvents();
      // console.log(result);
      this.events = events;
    },
    onDeleteEvent(eventId, action = 'event') {
      console.log("eventId")
      console.log(eventId)
      this.deleteEventId = eventId;
      this.action = action;
      this.approveToDeleteEventPermanent = true;
    },
    async approvedDeleteEvent() {
      const action = this.action;
      console.log("eventId")

      this.approveToDeleteEventPermanent = false;
      const itemId = this.deleteEventId;
      console.log(itemId);

      if (action === 'event') {
        await this.deleteEvent({eventId: itemId});

      } else if (action === 'picture') {
        await this.deletePicture({pictureId: itemId});
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
          for (; i < this.images.length; i++) {
            const event = this.images[i];
            if (event.PictureId !== itemId) {
              data.push(event);
            }
          }
          this.images = data;
        }
      }
      this.deleteEventId = null;
      publishEvent(success, this.getMessage());
    },
    openNewEventPopup() {
      this.newEventPopup = true;
    },
    async submitNewEvent() {
      this.newEventPopup = false;

      if (this.eventName === null || this.eventLocation === null || this.eventDate === null) {
        publishEvent(success, "invalid event name or event location");
        return
      }

      const b = !this.rules[1](this.eventName);
      const b1 = this.eventLocation !== null && !this.rules[1](this.eventLocation);
      console.log(b1)
      console.log(b);
      if (b || b1) {
        publishEvent(success, "invalid event name or event location");
        return
      }
      console.log(this.eventName);
      console.log(this.eventDate);
      console.log(this.eventLocation);
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
      if (this.dropboxPath === null || this.eventId === null ) {
        publishEvent(false, "Invalid ");
        return
      }

      const b = !this.path[1](this.dropboxPath);
      console.log(b);
      if (b) {
        publishEvent(false, "invalid event name or event location");
        return
      }

      await this.newImagesToRekognition({
        path: this.dropboxPath,
        eventId: this.eventId
      }).then().then(err => console.log(err));
      this.newImageToProcessingPopup = false;
      publishEvent(true, "Отправлено на обработку");
    },
    setEventId(item) {
      console.log(item);
      this.eventId = Number.parseInt(item.substring(0, item.indexOf(' ')));
    },
    async searchEventImages(eventId, page = 0) {
      this.isShow = true;
      this.eventId = eventId;
      const response = await axios.get(`${BASE_URL}/api/v1/picture/search?eventId=${eventId}&offset=${this.imagePage * this.limit}`);
      const data = response.data;
      const countPages = Math.ceil(data.CountAllItems / this.limit);
      console.log(countPages);
      this.countPages = countPages;
      this.imagePage = page;
      this.images = data.Pictures;
      console.log(data);
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
    // async fetchUserPlaylists() {
    //   await this.getPlaylists();
    //   this.playlists = this.getPlaylistsRequestResult();
    // },
    // async fetchPlaylist(playlistId) {
    //   await this.findPlaylist({playlistId: playlistId});
    //   this.playlist = this.getPlaylistResult();
    //   console.log(`      this.playlist = this.getPlaylist();`);
    //   console.log(this.playlist);
    // },
    // async removeVideoFromPlaylist(playlistId, videoId) {
    //   const videos = [];
    //   videos.push(videoId);
    //
    //   await this.doPlaylistModification({action: playlistModification.RemoveVideo, playlistId: playlistId, videos: events})
    //   this.errors = this.getErrors();
    //
    //   publishEvent(this.getStatus(), this.getMessage());
    // },
    // isPlaylistId(currentPlaylist) {
    //   return Number.isInteger(parseInt(currentPlaylist));
    // },
  },
}
</script>

<style scoped>

</style>