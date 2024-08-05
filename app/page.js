'use client'
import React, {useState, useEffect} from 'react'
import dynamic from 'next/dynamic'
import { firestore } from "@/firebase"
import { Box, Button, Modal, Stack, TextField, Typography, Container, AppBar, Toolbar} from "@mui/material"
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore"
import AccountMenu from './accountMenu'
import { useAuth } from './authentication/authContext'
import { useRouter } from 'next/navigation'

const WebcamCapture = dynamic(() => import('./WebcamCapture'), { ssr: false });

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [openWebcam, setOpenWebcam] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    if (!currentUser) {
      router.push('/authentication/sign-in');
    }
  }, [currentUser, router]);

  const updateInventory = async () => {
    if (!currentUser) return;

    const snapshot = query(
      collection(firestore, 'users', currentUser.uid, 'inventory')
    ); // reference
    const docs = await getDocs(snapshot); // query snapshot
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItem = async (item) => {
    if (!currentUser) return;

    const docRef = doc(
      collection(firestore, 'users', currentUser.uid, 'inventory'),
      item.name
    ); // reference
    const docSnap = await getDoc(docRef); // document snapshot

    if (docSnap.exists()) {
      const { quantity, imageUrl } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1, imageUrl: item.imageUrl || imageUrl });
    } else {
      await setDoc(docRef, { quantity: 1, imageUrl: item.imageUrl });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    if (!currentUser) return;

    const docRef = doc(
      collection(firestore, 'users', currentUser.uid, 'inventory'),
      item
    ); // reference
    const docSnap = await getDoc(docRef); // document snapshot

    if (docSnap.exists()) {
      const { quantity, imageUrl } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1, imageUrl: item.imageUrl || imageUrl});
      }
    }

    await updateInventory();
  };

  const searchItem = (searchTerm) => {
    if (searchTerm === '') {
      setFilteredInventory(inventory) // If search term is empty, show all items
    } else {
      const filteredList = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredInventory(filteredList)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleWebcamOpen = () => setOpenWebcam(true);
  const handleWebcamClose = () => setOpenWebcam(false);

  const handleCapture = (imageUrl) => {
    setItemImage(imageUrl);
    handleWebcamClose();
  };

  const handleAddItem = () => {
    addItem({ name: itemName, imageUrl: itemImage });
    setItemName('');
    setItemImage('');
    handleClose();
  };

  useEffect(() => {
    updateInventory()
  },[currentUser])

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Inventory Management
        </Typography>
        <AccountMenu />
      </Toolbar>
    </AppBar>
    
    <Box 
      mt={4}
      display="flex" 
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="background.paper"
          borderRadius={1}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
          </Stack>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            {itemImage && (
              <img
                src={itemImage}
                alt="Captured"
                style={{ width: 200, height: 200, marginBottom: 16 }}
              />
            )}
            <Button variant="contained" onClick={handleAddItem}>
              Add
            </Button>
          </Box>
          <Button variant="contained" onClick={handleWebcamOpen}>
              Open Webcam
            </Button>
        </Box>
      </Modal>

      <Modal open={openWebcam} onClose={handleWebcamClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="background.paper"
            borderRadius={1}
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography variant="h6">Capture Item Image</Typography>
            <WebcamCapture onCapture={handleCapture} />
          </Box>
        </Modal>
      
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          id="searchBar"
          variant="outlined"
          fullWidth
          value={filterName}
          onChange={(e) => {
            setFilterName(e.target.value)
            searchItem(e.target.value)
          }}
          placeholder="Search item"
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={handleOpen}
        >
          Add New Item
        </Button>
      </Box>
      
      <Box border={1} borderColor="divider" borderRadius={1} p={2} width="100%">
        <Box
          width="100%"
          bgcolor="primary.main"
          color="primary.contrastText"
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={1}
          mb={2}
        >
          <Typography variant="h4">Inventory Items</Typography>
        </Box>
        
        <Stack spacing={2} sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredInventory.map(({ name, quantity, imageUrl }) => (
              <Box
                key={name}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="background.paper"
                p={2}
                borderRadius={1}
                boxShadow={1}
              >
                <Box display="flex" alignItems="center">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={name}
                      style={{ width: 50, height: 50, borderRadius: '50%', marginRight: 16 }}
                    />
                  )}
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem({ name });
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      removeItem(name);
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
      </Box>
    </Box>
  </Container>
  );
}
