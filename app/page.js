'use client'
import Image from 'next/image'
import React, {useState, useEffect, useCallback} from 'react'
import dynamic from 'next/dynamic'
import { firestore } from "@/firebase"
import { Box, Button, Modal, Stack, TextField, Typography, Container, AppBar, Toolbar, Paper, Grid, IconButton, InputAdornment, Fade } from "@mui/material"
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore"
import AccountMenu from './accountMenu'
import { useAuth } from './authentication/authContext'
import { useRouter } from 'next/navigation'
import { Add, Remove, Search } from '@mui/icons-material'

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

  const updateInventory = useCallback(async () => {
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
  }, [currentUser]);

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
      setFilteredInventory(inventory); // If search term is empty, show all items
    } else {
      const filteredList = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventory(filteredList);
    }
  };

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
  },[currentUser, updateInventory])

  return (
    <Box className="bg-pattern" sx={{ minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
            Inventory Tracker
          </Typography>
          <AccountMenu />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Fade in={true} timeout={1000}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mr: 2, backgroundColor: 'background.paper', borderRadius: 2 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpen}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Add New Item
                  </Button>
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                  Inventory Items
                </Typography>
                <Box sx={{ maxHeight: 500, overflow: 'auto', pr: 2 }}>
                  {filteredInventory.map(({ name, quantity, imageUrl }) => (
                    <Fade in={true} timeout={500} key={name}>
                      <Paper elevation={2} sx={{ p: 3, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 3, transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                        <Box display="flex" alignItems="center">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={name}
                              width={60}
                              height={60}
                              style={{ borderRadius: '50%', marginRight: 20, objectFit: 'cover' }}
                            />
                          )}
                          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                          Quantity: {quantity}
                        </Typography>
                        <Box>
                          <IconButton onClick={() => addItem({ name })} color="primary" sx={{ mr: 1 }}>
                            <Add />
                          </IconButton>
                          <IconButton onClick={() => removeItem(name)} color="secondary">
                            <Remove />
                          </IconButton>
                        </Box>
                      </Paper>
                    </Fade>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      </Container>

      {/* Add Item Modal */}
      <Modal open={open} onClose={handleClose}>
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>Add Item</Typography>
            <TextField
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              margin="normal"
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <Box display="flex" justifyContent="center" mb={3}>
              {itemImage && (
                <Image
                  src={itemImage}
                  alt="Captured"
                  width={200}
                  height={200}
                  style={{ borderRadius: 16, objectFit: 'cover' }}
                />
              )}
            </Box>
            <Button fullWidth variant="outlined" onClick={handleWebcamOpen} sx={{ mb: 2 }}>
              Open Webcam
            </Button>
            <Button fullWidth variant="contained" onClick={handleAddItem}>
              Add Item
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Webcam Modal */}
      <Modal open={openWebcam} onClose={handleWebcamClose}>
        <Fade in={openWebcam}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>Capture Item Image</Typography>
            <WebcamCapture onCapture={handleCapture} />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
