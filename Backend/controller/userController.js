import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from 'fs';
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
// ========== REGISTER ==========
export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;
   
    let profileImageUrl = null;
    const userProfile=req.file
    console.log(userProfile)

// Uploading Image to The Cloudinary
if (userProfile) {
  try {
    const localPath = req.file.path;
    const publicId = path.parse(req.file.filename).name;

    console.log("Uploading image to Cloudinary...");

    const result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
    });

    profileImageUrl = result.secure_url;

    console.log("✅ Image uploaded to Cloudinary successfully.");
    console.log("🌐 Cloudinary URL:", profileImageUrl);

    // Optional: delete the local file after upload
    fs.unlinkSync(localPath);
    console.log("🗑️ Local file deleted:", localPath);

  } catch (uploadError) {
    console.error("❌ Error uploading image to Cloudinary:", uploadError.message);
    return res.status(500).json({ message: "Image upload failed", success: false });
  }
}

    console.log("this is coming in register")

  
    if (!fullName || !email || !password || !phone || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      phone,
      password: encryptedPassword,
      role,
      profile:{
        file:profileImageUrl || "",
        bio: " "
      }
    });

    await newUser.save();

    return res.status(200).json({
      message: "User successfully registered",
      success: true,
      newUser,
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error in registration" });
  }
};

// ========== LOGIN ==========
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    // Compare password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    // Check role
    if (user.role !== role) {
      return res.status(400).json({ message: "User role mismatch", success: false });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        usermail: user.email,
        userrole: user.role
      },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Send token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,           // For localhost
      sameSite: 'Lax',         // Safer cross-origin handling for localhost
      maxAge: 60 * 60 * 1000,  // 1 hour
      path: '/'                // Make sure cookie is available site-wide
    });

    // Send user data (excluding password) as JSON response
    const { password: _, ...userData } = user._doc;
    
    // THIS WAS COMMENTED OUT - YOU NEED TO SEND THE RESPONSE!
    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: userData
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error in login" });
  }
};

// ========== LOGOUT ==========
export const logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      path: '/'
    });
    
    return res.status(200).json({
      user:"",
      message: "User logout successful",
      success: true
    });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ message: "Server error in logout" });
  }
};

// ========== PROFILE UPDATE ==========
// Fixed backend ProfileUpdate function
export const ProfileUpdate = async (req, res) => {
  try {
    console.log("🔧 Starting profile update...");
    console.log("📥 Request body:", req.body);
    console.log("📁 File info:", req.file ? req.file.originalname : "No file uploaded");

    const { fullName, email, phone, role } = req.body;
    // const file = req.file;
    const files = req.files;
    const profileImage = files?.file?.[0];
    const resumeFile = files?.resume?.[0];


    // Create update object only with fields that were sent
    const updateUser = {};

    // Only add fields that are actually being updated
    if (fullName !== undefined && fullName.trim() !== '') {
      updateUser.fullName = fullName.trim();
      console.log("✏️ fullName to update:", fullName);
    }
    
    if (email !== undefined && email.trim() !== '') {
      updateUser.email = email.trim();
      console.log("✏️ email to update:", email);
    }
    
    if (phone !== undefined && phone.trim() !== '') {
      updateUser.phone = phone.trim();
      console.log("✏️ phone to update:", phone);
    }

    // Handle image upload to Cloudinary
    if (profileImage) {
  const localPath = profileImage.path;
  const publicId = path.parse(profileImage.filename).name;

  const result = await cloudinary.uploader.upload(localPath, { public_id: publicId });
  const profileImageUrl = result.secure_url;

  fs.unlinkSync(localPath);
  updateUser["profile.file"] = profileImageUrl;
  console.log("✅ Profile image uploaded:", profileImageUrl);
}

    // Handle resume upload to Cloudinary
//     if (resumeFile) {
//   const localPath = resumeFile.path;
//   const publicId = path.parse(resumeFile.filename).name;

//   const result = await cloudinary.uploader.upload(localPath, {
//     public_id: publicId,
//     resource_type: 'raw',
//     access_mode: 'public' // 📌 Important for non-image files
//   });

//   const resumeUrl = result.secure_url;
//   fs.unlinkSync(localPath);
//   updateUser["profile.resume"] = resumeUrl;
//   console.log("✅ Resume uploaded:", resumeUrl);
// }
if (resumeFile) {
  const localPath = resumeFile.path;
  const publicId = path.parse(resumeFile.filename).name;

  // Upload the resume file to the 'assets' folder instead of 'resumes'
  const result = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    folder: 'assets',              // ✅ Upload to the 'assets' folder (same as images)
    resource_type: 'raw',          // ✅ Because it's a non-image file
    access_mode: 'public',         // ✅ Make it publicly accessible
    use_filename: true,
    unique_filename: false,
    type: 'upload'
  });

  const resumeUrl = result.secure_url;
  // fs.unlinkSync(localPath);  
  fs.unlinkSync(localPath);      // Clean up local file
  updateUser["profile.resume"] = resumeUrl;

  console.log("✅ Resume uploaded and made public:", resumeUrl);
}





    // Check if there are any fields to update
    if (Object.keys(updateUser).length === 0) {
      console.log("⚠️ No fields to update");
      return res.status(400).json({ 
        message: "No fields to update", 
        success: false 
      });
    }

    console.log("🛠️ Update object:", updateUser);
    console.log("🔄 Updating user in database...");

    // Update user in database
    await User.findByIdAndUpdate(req.user._id, { $set: updateUser });

    console.log("🔄 Fetching updated user (excluding password)...");
    const updatedUser = await User.findById(req.user._id).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ 
        message: "User not found", 
        success: false 
      });
    }
    console.log(updateUser)
    console.log("✅ User profile updated successfully.");
    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (err) {
    console.error("❌ Profile Update Error:", err);
    return res.status(500).json({ 
      message: "Server error in profile update", 
      success: false 
    });
  }
};

// Make sure your route is correctly configured
// router.route("/profile/update").put(uploadImage, isAuthenticated, ProfileUpdate);