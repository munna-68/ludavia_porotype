'use client';

import { FormEvent, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '@astryxdesign/core/Button';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { TextInput } from '@astryxdesign/core/TextInput';
import { fadeUpTransition, fadeUpVariants, reducedMotionTransition } from '@/lib/motion';

export function AskVia21() {
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
        <motion.form
          className="ask-via21__form"
          onSubmit={handleSubmit}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          variants={fadeUpVariants}
          transition={shouldReduceMotion ? reducedMotionTransition : fadeUpTransition}
        >
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
        </motion.form>
        <AnimatePresence initial={false}>
          {submitted ? (
            <motion.p
              className="ask-via21__response"
              role="status"
              initial={shouldReduceMotion ? false : 'hidden'}
              animate="visible"
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              variants={fadeUpVariants}
              transition={shouldReduceMotion ? reducedMotionTransition : fadeUpTransition}
            >
              Via21 will keep this follow-up attached to the current recommendation. No chat history or outside action is created.
            </motion.p>
          ) : null}
        </AnimatePresence>
      </Collapsible>
    </section>
  );
}
