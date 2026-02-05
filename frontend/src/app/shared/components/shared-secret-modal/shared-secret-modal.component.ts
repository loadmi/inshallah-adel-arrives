import { Component, EventEmitter, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Question {
  text: string;
  answers: string[];
}

@Component({
  selector: 'app-shared-secret-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-secret-modal.component.html',
  styleUrls: ['./shared-secret-modal.component.scss']
})
export class SharedSecretModalComponent {
  @Output() accessGranted = new EventEmitter<void>();
  private router = inject(Router);

  readonly questions: Question[] = [
    {
      text: "You are invited to an event that will start at 8 PM, Google maps says it will take you 15 minutes to get there. At what time do you leave out the door?",
      answers: [
      "7:40 PM",
      "8:00 PM",
      "Anywhere between 8 PM and 9:00 PM",
      "I will send message of a delay once it gets past 8:30"
      ]
    },
    {
      text: "Which response describes your likely actions in the event of running late for a meeting?",
      answers: [
        "I will send message of a delay in advance with a specific new arrival time", 
        "I will send message of a delay once the meeting starts",
        "I will just show up late",
        "What meeting?"]
    },
    {
      text: "You have an event in your calendar starting at 18:00. What does that time represent?",
      answers: [
        "The time I should be there",
        "The time I should leave",
        "The time I should start thinking about leaving",
        "A vague suggestion"
      ]
    },
    {
      text: "You text someone: 'Leaving now.' What does that usually mean?",
      answers: [
        "I am already outside and on my way",
        "I am putting on my shoes",
        "I am about to start getting ready",
        "It means nothing and buys me time"
      ]
    },
    {
      text: "You estimate the trip will take 30 minutes. How much buffer do you add?",
      answers: [
        "10–15 minutes",
        "A few minutes",
        "None",
        "Buffer is for other people"
      ]
    },
    {
      text: "You are ready earlier than expected. What do you do?",
      answers: [
        "Leave early",
        "Leave at the planned time",
        "Wait a bit",
        "Get comfortable again"
      ]
    },
    {
      text: "You check the clock and realize it’s already later than you planned. What’s your reaction?",
      answers: [
        "I adjust and hurry",
        "I send an update",
        "I ignore it briefly",
        "Time has betrayed me"
      ]
    },
    {
      text: "What does 'almost there' mean when you say it?",
      answers: [
        "Less than 5 minutes away",
        "On the way",
        "About to leave",
        "It buys me time"
      ]
    },
    {
      text: "You underestimate travel time. What do you learn?",
      answers: [
        "Add buffer next time",
        "Adjust slightly",
        "Nothing",
        "That travel time is subjective"
      ]
    },
    {
      text: "You promise to be on time next time. What does that mean?",
      answers: [
        "I will plan better",
        "I will try",
        "I hope so",
        "Words were said"
      ]
    },
  ];

  currentStep = signal(0);
  hasClickedAnswer = signal(false);
  isFinished = signal(false);
  isAccessGranted = signal(false);
  isStarted = signal(false);

  get currentQuestion() {
    return this.questions[this.currentStep()];
  }

  startQuiz() {
    this.isStarted.set(true);
  }

  get isLastStep() {
    return this.currentStep() === this.questions.length - 1;
  }

  getDisplayAnswers() {
    const answers = [...this.currentQuestion.answers];
    if (this.isLastStep && !this.hasClickedAnswer()) {
      // Replace the 3rd answer with the secret one
      answers[2] = 'Wallāhi mish Adel';
    }
    return answers;
  }

  onAnswer(index: number) {
    if (this.isLastStep && !this.hasClickedAnswer() && index === 2) {
      this.isAccessGranted.set(true);
    } else {
      this.hasClickedAnswer.set(true);
    }
    this.nextStep();
  }

  onSkip() {
    this.nextStep();
  }

  private nextStep() {
    if (this.isLastStep) {
      this.isFinished.set(true);
      if (this.isAccessGranted()) {
        this.accessGranted.emit();
      }
    } else {
      this.currentStep.update(s => s + 1);
    }
  }

  onGoBack() {
    this.router.navigate(['/']);
  }

  onClose() {
    if (!this.isAccessGranted()) {
      this.router.navigate(['/predict']);
    }
  }
}
