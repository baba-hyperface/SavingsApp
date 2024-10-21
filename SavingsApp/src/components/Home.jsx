import React from 'react';
import {Box,Text,Heading,VStack,SimpleGrid,Icon,Container,Stack,Link,} from '@chakra-ui/react';
import { GiMoneyStack,GiPiggyBank,GiCash  } from 'react-icons/gi';
import { AiOutlineDollar } from 'react-icons/ai';
import { BiRupee } from 'react-icons/bi';
import { MdAttachMoney } from 'react-icons/md';
import { FaWallet, FaPiggyBank, FaHistory, FaJira } from 'react-icons/fa';

const Home = () => {
  return (
    <Box  pt={10} pb={10} >
      <Container maxW="7xl">

        <VStack spacing={6} textAlign="center" pt={10} pb={10}>
          <Heading as="h1" size="2xl">
            Welcome to Coin Stach
          </Heading>
          <Text fontSize={{base:'md',md:'lg'}} >
            Manage your wallet, create saving pots, and track your transactions with ease!
          </Text>
        </VStack>

        <SimpleGrid columns={{base:1,sm:2,md:3}} spacing={10} pt={10} pb={10} >
          
          <FeatureCard title="Wallet System" icon={FaWallet}
            description="Add money to your wallet and manage your balance effortlessly." />

          <FeatureCard
            title="Savings Pots"
            // icon={MdAttachMoney}
            icon={GiCash}
            // icon={BiRupee}
            description="Create personalized savings pots to reach your financial goals." />

          <FeatureCard title="Transaction History" icon={FaHistory} 
            description="Track your deposits, transfers, and withdrawals in one place." />
        </SimpleGrid>

        <Box textAlign="center" pt={10} pb={10} >
          <Heading as="h2" size="lg" mb={4}>
            Why Choose Our App?
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600" maxW="2xl" mx="auto">
            Our app is designed to help you manage your savings with ease and transparency. Whether you're saving for a vacation, an emergency fund, or simply managing your budget, our wallet and pots system makes it easy to keep track of your money.
          </Text>
        </Box>

        <Footer />
      </Container>
    </Box>
  );
};

const FeatureCard = ({ title, icon, description }) => {
  return (
    <VStack borderRadius="lg" boxShadow="lg" p={6} align="center" spacing={4} textAlign="center">
      <Icon as={icon} w={12} h={12} color={"blue.500"} />
      <Heading as="h3" size="md">
        {title}
      </Heading>
      <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>
        {description}
      </Text>
    </VStack>
  );
};

const Footer = () => {
  return (
    <Box  pt={10} pb={10}>
      <Container maxW="7xl">
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justify="space-between" align="center" textAlign="center" >
          <Text fontSize="sm" color="gray.600">
            © {new Date().getFullYear()} Savings Hub. All rights reserved.
          </Text>
          <Stack direction="row" spacing={4}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;