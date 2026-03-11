<!-- <template>
	 <view  >
		<view   class="u-p-l-20 u-p-t-20" v-show="girdTitle.length>0">{{girdTitle}}</view>
		<view  >
			<u-grid :col="4" hover-class="none" :border="false">
				<u-grid-item 
						v-for="(girdItem,index) in girdList"
						:key="index" :custom-style="customGirdStyle" @click="girdClick(index)">
					<u-icon :name="girdItem.icon" :size="46" :color="mainColor"></u-icon>
					<view   v-if="girdItem.title.length<=5" class="u-line-1 u-font-24 u-p-t-4">{{girdItem.title}}</view>
					<view   v-if="girdItem.title.length>5" style="font-size: 8px;">
					 <view   style="font-size: 8px;">{{girdItem.title.substring(0,5)}}</view>
					 <view   style="font-size: 8px;">{{girdItem.title.substring(5,10)}}</view>
					</view>
				</u-grid-item>
			</u-grid>
		</view> 
	</view>
</template>


<script>
	export default {
		name:"girdBox",
		props:{
			 mainColor:{
				type:String,
				default:'#000000'
			},
			girdList:{
				default:[],
				type:Array,
			},
			girdTitle:{
				default:'',
				type:String
			}	
		},
		data() {
			return {
				customGirdStyle:{
					padding: '20rpx 0',
					color:'#000000'
				},
			
			};
		},
		mounted:function(){
		 
		},
		
		methods:{
			girdClick:function(index){
				let girdItem=this.girdList[index];
				this.$emit("toNext",girdItem);
			},
		}
	}
</script>

<style scoped lang="scss">
</style> -->