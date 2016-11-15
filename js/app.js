App = Ember.Application.create();

App.Router.map(function() {
  this.route("about");
  this.route("projects");
  this.resource("exhibits", function(){
    this.resource("exhibit", { path: "/:exhibit_id"});
  });
  this.route("notes");
});

/*
 * COLLECTIONS CODE STARTS HERE
 */

// Collections Route
App.ProjectsRoute = Ember.Route.extend({
  model: function() {
    return [
      {
        title: "Project 1",
        copy: "Risse is a multi-disciplinary artist living in Portland Oregon. She makes immersive installations from everyday materials like cardboard, PVC pipe, Canvas drop-cloth, and fabric remnants. She holds a Masters of Fine Arts from Pacific Northwest College of Art in Portland Oregon and a Bachelors of Fine Arts from California College of the Arts in San Francisco, California.",
        image: "images/artists/risse-150x150.jpg"
      }, {
        title: "Project 2",
        copy: "Jason Berlin Thomas was born in Longview Washington. Berlin works predominantly in the medium of oil painting, but includes sculpture in his oeuvre. Berlin is currently in the Masters of Fine Arts in Visual Studies at Hallie Ford School of Graduate Studies at Pacific Northwest College of Art. He completed a BFA with distinction at Oregon College of Art and Craft in Portland Oregon in 2013.",
        image: "images/artists/berlin-150x150.jpg"
      }, {
        title: "Project 3",
        copy: "Reed's recent work relies upon digital and found photography as she blends together traditional craft and contemporary media to investigate interpersonal relationships and contemporary culture. Her process employs digital media reinterpreted through stitching and embroidery, creating works that develop a conversation between the ethereal world of technology and the hand-hewn physicality of craft.",
        image: "images/artists/reed-150x150.jpg"
      }
    ];
  }
});

// Customize the Collections component
App.SingleProjectComponent = Ember.Component.extend({
  tagName: "article",
  classNames: ["projectArticleClass cf"]
});

/*
 * CONTROLLERS CODE STARTS HERE
 */

// Route for all Exhibits
App.ExhibitsRoute = Ember.Route.extend({
  model: function() {
    return $.getJSON("js/exhibits.json").then(function(data) {
      return data.exhibits;
    });
  }
});

// Route for a single Exhibit
App.ExhibitRoute = Ember.Route.extend({
  model: function(params) {
    return $.getJSON("js/exhibits.json").then(function(data) {
      var modelId = params.exhibit_id - 1;
      data.exhibits.title = data.exhibits[modelId].title;
      data.exhibits.artist_name = data.exhibits[modelId].artist_name;
      data.exhibits.exhibit_info = data.exhibits[modelId].exhibit_info;
      data.exhibits.exhibit_date = data.exhibits[modelId].exhibit_date;
      data.exhibits.image = data.exhibits[modelId].image;
      return data.exhibits;
    });
  }
});

// Array controller...decorates all model data
App.ExhibitsController = Ember.ArrayController.extend({
  totalExhibits: function(){
    return this.get("model.length");
  }.property("@each")
});

// Object controller...decorates a single piece of model data
App.ExhibitController = Ember.ObjectController.extend({
  exhibitTitle: function(){
    return this.get("title") + " by " + this.get("artist_name");
  }.property("artist_name", "title")
});

/*
 * NOTES CODE STARTS HERE
 */

 App.Note = DS.Model.extend({
  copy: DS.attr()
});

App.NotesRoute = Ember.Route.extend({
  model: function() {
    return this.store.find("note");
  }
});

App.NotesController = Ember.ArrayController.extend({
  actions: {
    newNote: function() {
      var copy = this.get("newNote");
      if (!copy) {
        return false;
      }

      var note = this.store.createRecord("note", {
        copy: copy
      });

      this.set("newNote", "");
      note.save();
    }
  }
});

App.NoteController = Ember.ObjectController.extend({
  isEditing: false,
  actions: {
    editNote: function() {
      this.set("isEditing", true);
    },
    saveNewNote: function() {
      this.set("isEditing", false);
      
      if (!(this.get("model.copy"))) {
        this.send("deleteNote");
      } else {
        this.get("model").save();
      }
    },
     deleteNote: function() {
      this.get("model").deleteRecord();
      this.get("model").save();  
    }
  }
});

App.EditNote = Ember.TextArea.extend({
  attributeBindings: ["cols", "rows"],
  cols: 50,
  rows: 10
});

Ember.Handlebars.helper("update-note", App.EditNote);

App.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: "samocaNotes"
});