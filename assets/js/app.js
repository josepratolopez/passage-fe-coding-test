        $(document).ready(function() {
            $('#progress').hide()

            /**
             * 
             * PLASE NOTE:
             * 
             * Modify wpmThreshold var to change the minimum typing speed to pass levels
             * 
             */
            let wpmThreshold = 20;
            let currentCharIndex = 0;
            let typedChars = 0;
            let correctChars = 0;
            let startTime = new Date();

            const fetchHarryPotterText = lesson => {
                currentCharIndex = 0;
                $('#progress').show();
                $('#feedback').text('');
                $('#user-input').prop('disabled', false);
                $('#user-input').val('');
                /**
                 * 
                 * PLASE NOTE:
                 * 
                 * Modify the following array to change the texts and start playing with your own creativity
                 * 
                 */
                const challengeLevels = [
                    "Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. They were the last people you'd expect to be involved in anything strange or mysterious, because they just didn't hold with such nonsense.",
                    "Mr. Dursley was the director of a firm called Grunnings, which made drills. He was a big, beefy man with hardly any neck, although he did have a very large mustache. Mrs. Dursley was thin and blonde and had nearly twice the usual amount of neck, which came in very useful as she spent so much of her time craning over garden fences, spying on the neighbors. The Dursleys had a small son called Dudley and in their opinion there was no finer boy anywhere.",
                    "The Dursleys had everything they wanted, but they also had a secret, and their greatest fear was that somebody would discover it. They didn't think they could bear it if anyone found out about the Potters. Mrs. Potter was Mrs. Dursley's sister, but they hadn't met for several years; in fact, Mrs. Dursley pretended she didn't have a sister, because her sister and her good-for-nothing husband were as unDursleyish as it was possible to be. The Dursleys shuddered to think what the neighbors would say if the Potters arrived in the street. The Dursleys knew that the Potters had a small son, too, but they had never even seen him. This boy was another good reason for keeping the Potters away; they didn't want Dudley mixing with a child like that.",
                    "Mr. Dursley always sat with his back to the window in his office on the ninth floor. If he hadn't, he might have found it harder to concentrate on drills that morning. He didn't see the owls swoop ing past in broad daylight, though people down in the street did; they pointed and gazed open- mouthed as owl after owl sped overhead. Most of them had never seen an owl even at nighttime. Mr. Dursley, however, had a perfectly normal, owl-free morning. He yelled at five different people. He made several important telephone calls and shouted a bit more. He was in a very good mood until lunchtime, when he thought he'd stretch his legs and walk across the road to buy himself a bun from the bakery."
                ];
                /**
                 * 
                 * PLASE NOTE:
                 * 
                 * Modify ....replace(/[^---> asdf <--- ]/gi, '')... with the characters that are going to appear according to the level text
                 * 
                 */
                filteredText = challengeLevels[currentLesson - 1].replace(/[^asdf ]/gi, '').replace(/\s+/g, " ").toLowerCase().trim();
                console.log(filteredText)
                $('#lesson-text').text(filteredText);
            }

            const updateProgress = () => {
                if (!startTime) return;
                elapsedTime = (new Date() - startTime) / 1000;
                wpm = Math.floor((correctChars / 5) / elapsedTime * 60);
                accuracy = Math.floor((correctChars / typedChars) * 100);
                $("#progress").text(`Speed: ${wpm} WPM | Accuracy: ${accuracy}%`);
            };

            const handleUserInput = (event) => {

                updateProgress();
                $("#feedback").text("");
                const typedChar = event.key;

                if (currentCharIndex >= filteredText.length) return;

                typedChars++;

                if (typedChar === filteredText[currentCharIndex]) {
                    correctChars++;
                    currentCharIndex++;

                    if (currentCharIndex === filteredText.length) {
                        if (wpm >= wpmThreshold) {
                            $("#feedback").text("Lesson completed!");
                            $('#user-input').prop('disabled', true);
                            startTime = null;
                            currentLesson++;
                            $('#lessonNumber').text(currentLesson);
                        } else {
                            $('#user-input').prop('disabled', true);
                            $("#feedback").text("Text completed, but the minimum speed was not reached. Please try again.");
                        }

                    }
                } else {
                    $("#feedback").text("Incorrect key. Please try again.");
                    $("#user-input").val($("#user-input").val().slice(0, -1));
                }

                const progressData = {
                    lesson: currentLesson,
                    wpm: wpm,
                    accuracy: accuracy
                };
                localStorage.setItem("typingPracticeProgress", JSON.stringify(progressData));
            };

            let savedProgress = JSON.parse(localStorage.getItem("typingPracticeProgress"));
            if (savedProgress) {
                $('#progress').show();
                currentLesson = savedProgress.lesson;
                elapsedTime = (new Date() - startTime) / 1000;
                wpm = Math.floor((correctChars / 5) / elapsedTime * 60);
                accuracy = Math.floor((correctChars / typedChars) * 100);
                $("#progress").text('Speed: ' + savedProgress.wpm + ' Words-Per-Minute | Accuracy: ' + savedProgress.accuracy + '%');
            } else {
                currentLesson = 1;

            }

            $("#user-input").on("keydown", handleUserInput);
            $("#start").on("click", fetchHarryPotterText)
            $('#lessonNumber').text(currentLesson);
        });