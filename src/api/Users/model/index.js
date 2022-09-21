    import mongoose from "mongoose"
    import bcrypt from "bcrypt"

    const {Schema, model} = mongoose

    const UserSchema = new Schema(
        {
            username:{type: String, required: true},
            email: {type:String, required: true},
            password: {type: String, required: true},
            avatar: {type: String, required: false},
            chats:[{type: Schema.Types.ObjectId, ref:"chat"}]
        },
        {
            timestamps: true
        }
    )

    UserSchema.pre("save", async function (next) {


        const currentUser = this
      
        const plainPW = currentUser.password
      
        if (currentUser.isModified("password")) {
      
      
          const hash = await bcrypt.hash(plainPW, 11)
          currentUser.password = hash
        }
      
        next()
      })

    UserSchema.static("checkCredentials", async function (email, plainPassword) {

        const user = await this.findOne({ email })
      
        if (user) {
          console.log("USER: ", user)
          const isMatch = await bcrypt.compare(plainPassword, user.password)
      
          if (isMatch) {
      
            return user
          } else {
            return null
          }
        } else {
          return null
        }
      })

      export default model("user", UserSchema)