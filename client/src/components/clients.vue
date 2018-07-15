<template>
  <div class="clients">

    <v-toolbar flat color="white">
      <v-toolbar-title>CLIENTS</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click.stop="dialog = true" color="info" class="mb-2">New Item</v-btn>

    </v-toolbar>

    <v-data-table :headers="headers" :items="clients" hide-actions class="elevation-1" scrollable>
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ props.item.phone }}</td>
        <td class="text-xs-left">{{ props.item.providers.onlyNames() }}</td>
        <td class="text-xs-left">
          <v-icon small class="mr-2" @click="editClient(props.item)">
            edit
          </v-icon>
          <v-icon small @click="confirmDelete(props.item)">
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <!--<v-btn color="primary" @click="initialize">Reset</v-btn>-->
      </template>
    </v-data-table>

    <v-dialog scrollable v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form wrap ref="form" v-model="formValid">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.name" label="Name" :rules="nameRules" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.email" label="Email" :rules="emailRules" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.phone" label="Phone" :rules="phoneRules" required></v-text-field>
                </v-flex>
                <v-flex xs6 sm8 md8>
                  <v-text-field v-model="pItem.name" label="New provider"></v-text-field>
                </v-flex>
                <v-flex xs4 sm4 md4>
                  <v-btn color="info" class="add--provider" @click.native="addProvider()">Add Provider</v-btn>
                </v-flex>
                <v-container fluid v-if="providers.length > 0" class="table-wrap">
                  <div class="layout" v-for="provider in providers">
                    <v-flex xs2 sm2 md2>
                      <v-checkbox v-model="editedItem.providers" :value="provider"></v-checkbox>
                    </v-flex>
                    <v-flex xs8 sm8 md8>
                      <v-text-field v-model="provider.name"></v-text-field>
                    </v-flex>
                    <v-flex xs2 sm2 md2 class="provider--icons">
                      <v-icon small class="mr-2" color="green" @click="saveProvider(provider)">
                        edit
                      </v-icon>
                      <v-icon small color="red" @click="delProvider(provider)">
                        delete
                      </v-icon>
                    </v-flex>
                  </div>
                </v-container>
                <v-container fluid v-if="providers.length == 0">
                  <p>Please, add providers.</p>
                </v-container>
              </v-layout>
            </v-container>

          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="success" @click.native="save" :disabled="!formValid || editedItem.providers.length == 0">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </div>

</template>

<script>
  import ClientsService from '../services/PostService'

  export default {
    name: 'clients',
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {text: 'Email', value: 'email'},
        {text: 'Phone', value: 'phone'},
        {text: 'Providers', value: 'providers'},
        {text: 'Actions', value: 'name', sortable: false}
      ],
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      phoneRules: [
        v => !!v || 'Phone is required',
        v => (v && v.length <= 20) || 'Phone must be less than 20 characters'
      ],
      formValid: false,

      clients: [],
      editedIndex: -1,

      editedItem: {
        name: '',
        email: '',
        phone: '',
        providers: []
      },
      defaultItem: {
        name: '',
        email: '',
        phone: '',
        providers: []
      },

      providers: [],
      pIndex: -1,
      pItem: {
        name: ''
      }
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
    },

    created() {
      this.initialize();
    },

    watch: {
      dialog: function(val) {
        if(!this.editedItem['email']) {
          this.$refs.form.reset();
          this.getProviders();
        }
        val || this.close()
      }
    },

    methods: {

      async initialize() {
        Array.prototype.onlyNames = function() {
          return this.filter((item) => {return item}).map((item) => {
            return item['name']
          }).join(",");
        };
        await this.getProviders();
        await this.getClients();
      },

      async getClients() {
        const response = await ClientsService.getClients();
        this.clients = response.data.clients;
      },

      async editClient(item) {
        this.editedIndex = this.clients.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.formValid = false;
        this.dialog = true;
      },

      confirmDelete(item) {
        confirm('Are you sure you want to delete this item?') && this.deleteClient(item);
      },

      async deleteClient(item) {
        const index = this.clients.indexOf(item);
        await ClientsService.delClient({_id:item['_id']});
        this.clients.splice(index, 1);
      },

      async save() {
        const response = await ClientsService.saveClient(this.editedItem);
        if (response.data && !response.data.error) {
          if (this.editedIndex > -1) {
            Object.assign(this.clients[this.editedIndex], this.editedItem)
          } else {
            this.clients.push(this.editedItem)
          }
          this.close();
        }
      },

      close() {
        this.dialog = false;
        this.formValid = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1
        }, 300)
      },

      async getProviders() {
        this.providers = [];
        const response = await ClientsService.getProviders();
        this.providers = response.data.providers;
      },

      async addProvider() {
        const response = await ClientsService.saveProvider(this.pItem);
        if (response.data && !response.data.error) {
          this.pItem['_id'] = response.data._id;
          this.getProviders();
          this.pIndex = -1;
          this.pItem = {name: ''};
        }
      },

      async saveProvider(item) {
        this.pIndex = this.providers.indexOf(item);
        const response = await ClientsService.saveProvider(item);
        if (response.data && !response.data.error) {
          this.getProviders();
          this.pIndex = -1;
          this.pItem = {name: ''};
        }
      },

      async delProvider(item) {
        const index = this.providers.indexOf(item);
        await ClientsService.delProvider({_id:item['_id']});
        this.getProviders();
      }

    }
  }
</script>
