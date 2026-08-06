'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { TextInput } from '@astryxdesign/core/TextInput';

export function AskVia21() {
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuestion = question.trim();
    if (!nextQuestion) return;

    setQuestion(nextQuestion);
    setSubmitted(true);
  }

  return (
    <section className="ask-via21" aria-label="Ask Via21 about this insight">
      <Collapsible
        defaultIsOpen={false}
        trigger={<span className="ask-via21__trigger-label">Ask Via21 about this</span>}
      >
        <form className="ask-via21__form" onSubmit={handleSubmit}>
          <TextInput
            label="Your question"
            description="Keep it anchored to this growth briefing."
            value={question}
            placeholder="What should I test first?"
            width="100%"
            onChange={(value) => {
              setQuestion(value);
              setSubmitted(false);
            }}
          />
          <Button
            label="Ask about this insight"
            type="submit"
            variant="secondary"
            size="sm"
            isDisabled={!question.trim()}
          />
        </form>
        {submitted ? (
          <p className="ask-via21__response" role="status">
            Via21 will keep this follow-up attached to the current recommendation. No chat history or outside action is created.
          </p>
        ) : null}
      </Collapsible>
    </section>
  );
}
