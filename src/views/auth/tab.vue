<template>
  <section class="h-screen w-full">
    <modal 
    v-if="open"
    @close="closeModal"
    />
    <div class="w-full h-20 border-b border-slate-400 flex items-center justify-end px-6"> 
       <span 
       @click="showModal"
       class="py-2 px-3 text-sm font-bold border rounded cursor-pointer">
       Logout
      </span>
    </div>
    <div class="max-w-2xl mx-auto px-4 pt-10">
      <div class="tab_box w-[100%]">
                <div
                  v-for="(tab, index) in tabs"
                  :key="index"
                  @click="activateTab(index)"
                  class="w-full"
                >
                  <div
                    :class="['tab_btn w-[100%]', { active: activeTabIndex === index }]"
                  >
                    {{ tab }}
                  </div>
                </div>
              </div>
          <div>
            <section v-if="activeTabIndex == 0">
              <PumpAuthorization />
            </section>
            <section v-if="activeTabIndex == 1">
              <CardAuthorization />
            </section>
          </div>
        </div>
    </section>
</template>
  
  <script>
import CardAuthorization from '@/components/auth/card.vue'
import PumpAuthorization from '@/components/auth/pump.vue'
import modal from '@/components/modal'

export default {
  components: {
    PumpAuthorization,
    CardAuthorization,
    modal
  },
  data() {
    return {
      tabs: ["Authorize by pump", "Authorize by card"],
      contents: [PumpAuthorization,CardAuthorization],
      activeTabIndex: 0,
      tabButtonWidths: [],
      open:false,
    };
  },
  mounted() {
    if (this.tabButtonWidths.length > 0) {
      this.tabButtonWidths = this.$refs.tabButtons.map(
        (button) => button.offsetWidth
      );
    }
    
  },
  methods: {
    activateTab(index) {
      this.activeTabIndex = index;
    },
    showModal(){
       this.open = true;
    },
    closeModal(){
       this.open = false;
    }
  },
};
</script>
  
<style scoped>
 .tab_box {
  width: 100%;
  display: flex;
  align-items: center;
}

.tab_box .tab_btn {
  padding-bottom: 0.5rem;
  padding:0.5rem;
  color: #9299a8;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 19px; 
  cursor: pointer;
  border: 1px solid #9299a8;
}

.tab_btn.active {
  color: #001755;
  border: 1px solid #001755;
  font-weight: 700;
}
</style>
  