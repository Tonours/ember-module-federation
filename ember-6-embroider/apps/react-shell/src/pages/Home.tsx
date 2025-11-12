import React from 'react';
import { Card, CardTitle, CardHeader } from '@packages/ui';

export const Home = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Module Federation POC</CardTitle>
        </CardHeader>
        <div className="text-gray-600">
          <p className="mb-4">
            This is a proof of concept demonstrating Module Federation with:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>React Shell (Host Application) - Running on port 3000</li>
            <li>Profile MFE (Remote) - Running on port 3001</li>
            <li>Blog Article MFE (Remote) - Running on port 3002</li>
            <li>Ember 4 Application (iframe) - Running on port 4200</li>
            <li>REST API (JSON:API) - Running on port 3333</li>
          </ul>
          <p className="mt-4">
            Navigate using the menu above to explore different micro-frontends.
          </p>
        </div>
      </Card>
    </div>
  );
};
