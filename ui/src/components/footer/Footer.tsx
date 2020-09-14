import React from 'react';
import {
  Card,
  Grid,
  Text,
  GridItem,
  Flex,
  FlexItem,
  CardFooter,
  TextVariants,
  TextContent
} from '@patternfly/react-core';
import '@patternfly/react-core/dist/styles/base.css';
import tekton from '../../assets/logo/tekton.png';
import './footer.css';

const Footer: React.FC = () => {
  return (
    <React.Fragment>
      <Card>
        <Grid>
          <GridItem span={4} />
          <GridItem span={4} rowSpan={12}>
            <Flex>
              <FlexItem>
                <a href="https://cd.foundation">
                  <img src="https://tekton.dev/partner-logos/cdf.png" alt="tekton.dev" />
                </a>
              </FlexItem>
            </Flex>
            <Flex justifyContent={{ default: "justifyContentCenter" }}>
              <TextContent>
                <Text component={TextVariants.h1} style={{ color: 'white' }}>
                  Tekton is a{' '}
                  <Text component={TextVariants.a} href="https://cd.foundation">
                    Continuous Delivery Foundation
                  </Text>{' '}
                  project.
                </Text>
              </TextContent>
            </Flex>
            <Flex justifyContent={{ default: "justifyContentCenter" }}>
              <FlexItem >
                <img src={tekton} alt="Tekton" className="logo-size"/>
              </FlexItem>
            </Flex>
            <Flex>
              <CardFooter>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  © 2020 The Linux Foundation®. All rights reserved. The Linux Foundation has
                  registered trademarks and uses trademarks. For a list of trademarks of The Linux
                  Foundation, please see our{' '}
                  <Text
                    component={TextVariants.a}
                    href="https://www.linuxfoundation.org/trademark-usage/"
                  >
                    Trademark Usage page
                  </Text>
                  . Linux is a registered trademark of Linus Torvalds.{' '}
                  <Text component={TextVariants.a} href="https://www.linuxfoundation.org/privacy/">
                    Privacy Policy
                  </Text>{' '}
                  and{' '}
                  <Text component={TextVariants.a} href="https://www.linuxfoundation.org/terms/">
                    Terms of Use
                  </Text>{' '}
                  .
                </Text>
              </CardFooter>
            </Flex>
          </GridItem>

          <GridItem span={4}></GridItem>
        </Grid>
      </Card>
    </React.Fragment>
  );
};

export default Footer;
