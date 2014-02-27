
/**
 * Définition de l'objet Manta
 */
(function()
{
    /**
     * Constructeur
     */
    function	Manta(opts)
    {
    	this.opts = {
    		slides: [],
    		slidesPath: "slides",
    		template: "manta",
    	};

    	if (typeof(opts) === "object")
    	{
    		_(this.opts).extend(this.opts, opts);
    	}
    };

    Manta.prototype.toString = function() {
    	console.log("Configuration :");
    	_.each(this.opts, function(index, el)
    	{
    		console.log(el, index);
    	});
    };

    window.Manta = Manta;

})();