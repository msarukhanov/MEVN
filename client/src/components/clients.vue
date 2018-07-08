<template>
  <div class="clients theme--light">

    <v-toolbar flat color="white">
      <v-toolbar-title>CLIENTS</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="info" class="mb-2">New Item</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form wrap ref="form" v-model="formValid" lazy-validation>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.name" label="Name" :rules="nameRules" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.email" label="Email" :rules="emailRules" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.phone" label="Phone" :rules="phoneRules" required></v-text-field>
                </v-flex>
                <v-flex xs7 sm7 md7>
                  <v-text-field v-model="pItem.name" label="New provider"></v-text-field>
                </v-flex>
                <v-flex xs5 sm5 md5>
                  <v-btn color="info" @click.native="addProvider()">Add Provider</v-btn>
                </v-flex>
                <v-container fluid v-if="providers.length > 0" class="table-wrap">
                  <div class="layout" v-for="provider in providers">
                    <v-flex xs2 sm2 md2>
                      <v-switch v-model="editedItem.providers" :value="provider._id"></v-switch>
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
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="success" @click.native="save" :disabled="!formValid">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table :headers="headers" :items="clients" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ props.item.phone }}</td>
        <td class="text-xs-left">{{ props.item.providers.renameProviders() }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editClient(props.item)">
            edit
          </v-icon>
          <v-icon small @click="confirmDelete(props.item)">
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>

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
      formValid: true,

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
      providerNames: {},
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

    watch: {
      dialog(val) {
        val || this.close()
      }
    },

    created() {
      this.initialize();
      let names = this.providerNames;
      Array.prototype.renameProviders = function() {
        return this.filter((item) => {return item}).map((item) => {
          return names[item]
        }).join(",");
      };
    },

    methods: {
      initialize() {
        this.getProviders();
        this.getClients();
      },

      async getClients() {
        const response = await ClientsService.getClients();
        this.clients = response.data.clients;
      },

      async editClient(item) {
        this.editedIndex = this.clients.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.formValid = true;
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
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1
        }, 300)
      },

      async getProviders() {
        const response = await ClientsService.getProviders();
        this.providers = response.data.providers;
        this.providers.forEach((provider)=>{
          this.providerNames[provider['_id']] = provider['name'];
        })
      },

      async addProvider() {
        const response = await ClientsService.saveProvider(this.pItem);
        if (response.data && !response.data.error) {
          this.pItem['_id'] = response.data._id;
          this.providerNames[this.pItem['_id']] = this.pItem['name'];
          this.providers.push(this.pItem);
          this.pIndex = -1;
          this.pItem = {name: ''};
        }
      },

      async saveProvider(item) {
        this.pIndex = this.providers.indexOf(item);
        const response = await ClientsService.saveProvider(item);
        if (response.data && !response.data.error) {
          this.providerNames[item['_id']] = item['name'];
          Object.assign(this.providers[this.pIndex], item);
          this.pIndex = -1;
          this.pItem = {name: ''};
        }
      },

      async delProvider(item) {
        this.clients.forEach((client, key) => {
          if(client['providers'].indexOf(item['_id']) > -1) {
            this.clients[key]['providers'].splice(client['providers'].indexOf(item['_id']), 1);
            ClientsService.saveClient(this.clients[key]);
          }
        });
        const index = this.providers.indexOf(item);
        await ClientsService.delProvider({_id:item['_id']});
        this.providers.splice(index, 1);
      }

    }
  }
</script>
