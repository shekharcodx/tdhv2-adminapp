//  <Router>
//    //<Routes>
//          <Route path="/" element={<SignupForm />} />
//       <Route path="/details" element={<Details />} />
//      </Routes>
//     </Router>

//      <Router>
//        <Routes>
       
//         <Route path="/" element={<Profile/>} />

  
//       /<Route path="/user-form" element={<UserForm />} />
//       </Routes>
//    </Router> 
 <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/user-form" element={<UserForm />} />
          <Route path="/car-listing" element={<CarListing />} />
          <Route path="/admin-car" element={<CarListing />} />
          {/* add more routes if needed */}
        </Route>
      </Routes>
    </Router>
    