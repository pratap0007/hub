import React from 'react';
import {
  Card,
  CardHeader,
  CardActions,
  CardTitle,
  CardBody,
  TextContent,
  Badge,
  CardFooter,
  GalleryItem
} from '@patternfly/react-core';
import { BuildIcon, StarIcon, UserIcon } from '@patternfly/react-icons';
import './Cards.css';
import { IResource } from '../../store/resource';
import { resourceName } from '../../containers/Resources';
import { ITag } from '../../store/category';
import { Link } from 'react-router-dom';

interface catalog {
  id: number;
  name: string;
  selected: boolean;
  toggle: void;
}

interface kind {
  name: string;
  selected: boolean;
  toggle: void;
}

interface latestVersion {
  id: number;
  version: string;
  displayName: string;
  description: string;
  minPipelinesVersion: string;
  rawURL: string;
  webURL: string;
  updatedAt: string;
}

interface data {
  id: number;
  name: string;
  catalog: catalog;
  kind: kind;
  tags: [];
  versions: [];
  displayName: string;
  latestVersion: latestVersion;
  rating: number;
}
interface Props {
  resources: IResource[];
}

const Cards: React.FC<any> = ({ resources }) => {
  if (resources.length === 0) {
    return null;
  }

  return resources.map((resource: IResource, r: number) => (
    <GalleryItem key={r}>
      <Link
        to={{
          pathname: `${resources[r].catalog.name}/${resources[r].kind.name}/${resources[r].name}/${resources[r].latestVersion.version}/${resources[r].id}`
        }}
        style={{ textDecoration: 'none' }}
      >
        <Card className="hub-resource-card" key={r}>
          <CardHeader>
            <BuildIcon style={{ marginRight: '0.5em' }} />
            <UserIcon />

            <CardActions>
              <StarIcon />
              <TextContent className="text">{resources[r].rating}</TextContent>
            </CardActions>
          </CardHeader>

          <CardTitle>
            <span className="hub-resource-name">
              {resourceName(resources[r].name, resources[r].latestVersion.displayName)}
            </span>

            <span className="hub-resource-version">v{resources[r].latestVersion.version}</span>
          </CardTitle>

          <CardBody className="hub-resource-body fade">
            {resources[r].latestVersion.description}
          </CardBody>

          <CardFooter>
            <TextContent className="hub-resource-updatedAt">
              Updated {resources[r].latestVersion.updatedAt.fromNow()}
            </TextContent>

            <div style={{ height: '2.5em' }}>
              {resources[r].tags.slice(0, 3).map((tag: ITag) => (
                <Badge className="hub-tags" key={`badge-${tag.id}`}>
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </GalleryItem>
  ));
};

export default Cards;
