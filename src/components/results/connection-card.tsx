'use client';

import { useState } from 'react';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Token } from '@astryxdesign/core/Token';
import { ArrowUpRight } from 'lucide-react';
import { sampleConnection } from '@/data/sample-connection';
import { personalize } from '@/lib/personalize';
import type { BusinessNeedsInput } from '@/lib/types';

export function ConnectionCard({ values }: { values: BusinessNeedsInput }) {
  const [requested, setRequested] = useState(false);
  const location = personalize(sampleConnection.location, values);
  const context = personalize(sampleConnection.mutualContext, values);
  const whyConnect = personalize(sampleConnection.whyConnect, values);

  return (
    <Card className="result-card result-card--connection" padding={0} variant="transparent">
      <article>
        <header className="result-card__header">
          <p className="result-card__eyebrow">{sampleConnection.illustrativeLabel}</p>
          <div className="result-card__person">
            <Avatar name={sampleConnection.name} size="lg" tooltip={false} />
            <span className="result-card__person-copy">
              <h2 className="result-card__title">{sampleConnection.name}</h2>
              <p className="result-card__organization">{sampleConnection.role}</p>
            </span>
          </div>
          <p className="result-card__organization">{sampleConnection.organization} · {location}</p>
        </header>

        <section className="result-card__section result-card__section--tags" aria-labelledby="connection-expertise-heading">
          <h3 id="connection-expertise-heading">Focus</h3>
          <ul className="result-card__tags" aria-label="Areas of expertise">
            {sampleConnection.expertise.map((tag) => (
              <li key={tag}>
                <Token label={tag} size="sm" color="default" />
              </li>
            ))}
          </ul>
        </section>

        <section className="result-card__section" aria-labelledby="connection-fit-heading">
          <h3 id="connection-fit-heading">Why connect</h3>
          <p>{context} {whyConnect}</p>
        </section>

        <footer className="result-card__footer">
          <Button
            className="result-card__action"
            label="Explore connection"
            variant="secondary"
            size="sm"
            endContent={<ArrowUpRight aria-hidden="true" />}
            onClick={() => setRequested(true)}
          />
          {requested ? <p className="result-card__status" role="status">Prototype only: nothing was sent or stored.</p> : null}
        </footer>
      </article>
    </Card>
  );
}
