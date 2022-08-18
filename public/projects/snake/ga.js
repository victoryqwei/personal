function nextGeneration(organism, Mutation, saved) {
	// Update generation

	generation++;

	addData(Chart, generation, generationHighest.score, dataLimit);
	generationAverage = 0;

	calculateFitness();

	for (var i = 0; i < population; i++) {
		organism[i] = pickTop(Mutation);
	}	

	saved = [];
	score = 0;
	latest = undefined;
	generation++;

	return organism;
}

function indexOfSmallest(a) {
 	var lowest = 0;
 	for (var i = 1; i < a.length; i++) {
  		if (a[i] < a[lowest]) lowest = i;
 	}
 	return lowest;
}


function calculateFitness() {
	var sum = 0;
	for (var organism of saved) {
		sum += organism.score;
	}

	for (var organism of saved) {
		organism.fitness = organism.score / sum;
	}
}

function pickTop(Mutation) {
	var top = [];
	var topScores = [];
	var savedScores = [];

	for (var i = 0; i < saved.length; i++) {
		savedScores.push(saved[i].score);
	}

	// Get the top ten scores
	for (var i = 0; i < saved.length; i++) {
		if (top.length < 10) {
			top.push(saved[i]);
			topScores.push(saved[i].score);
		} else {
			var smallestIndex = indexOfSmallest(topScores);
			if (saved[i].score > topScores[smallestIndex]) {
				topScores[smallestIndex] = saved[i].score;
			}
		}
	}

	// Get the top ten snakes

	for (var i = 0; i < snakes.length; i++) {
		for (var j = 0; j < topScores.length; j++) {
			if (snakes[i].score === topScores[j].score) {
				top.push(snakes[i]);
			}
		}
	}

	 var random = Math.floor(Math.random() * top.length-1);
	 var organism = top[random];

	 if (organism) {
	 	var child = new Mutation(20, 30, organism.brain.copy());
	 } else {
	 	child = new Mutation(20, 30);
	 }
	
	child.mutate();
	return child;
}

function pickOne(Mutation) {
	var index = 0;
	var r = Math.random() * 1;

	while (r > 0) {
		r -= saved[index].fitness;
		index++;
	}

	index--;

	var organism = saved[index];
	var child = new Mutation(20, 30, organism.brain.copy());
	child.mutate();
	return child;

}
