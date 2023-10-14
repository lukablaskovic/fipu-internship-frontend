<script setup>
import SectionFullScreen from "@/components/Section/SectionFullScreen.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
</script>

<template>
	<SectionFullScreen v-slot="{ cardClass }" bg="blue">
		<CardBox class="rounded-lg" :class="cardClass">
			<div class="space-y-3">
				<h1 class="text-2xl">❌Nešto se zeznulo. Sorry!</h1>
				<p>Aplikacija ne radi. Vjerojatno radimo na tome.</p>
			</div>
		</CardBox>
	</SectionFullScreen>
</template>
